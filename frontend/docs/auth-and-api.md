# Auth & API client (`lib/auth.ts` + `lib/api.ts`)

How authentication and the shared HTTP client work together in this app, and why they're
built the way they are. Read this before touching either file.

## The short version

- **Source of truth for the token is NextAuth's session — nothing else.** There is no
  token in `localStorage`, no Zustand/Redux auth store, no manually-managed header object.
- `lib/api.ts` exports a single axios instance, `api`, used by every service
  (`services/**/*.service.ts`). It **automatically** attaches
  `Authorization: Bearer <token>` to every outgoing request via a request interceptor.
- You never call anything like `setAuth(token)`. If you're logged in (NextAuth has a
  valid session), `api` sends the token. If you're not, it doesn't. That's the whole
  contract.

```
component / server code
        │  api.get("/whatsapp/test")
        ▼
   lib/api.ts  (axios instance)
        │  request interceptor runs first
        ▼
  "where am I running?"
        │
        ├─ server (SSR, RSC, route handler) ─▶ auth() from lib/auth.ts ─▶ NextAuth JWT cookie
        │
        └─ browser ("use client")            ─▶ getSession() from next-auth/react
                                                    ─▶ GET /api/auth/session
        │
        ▼
  token found? → set config.headers.Authorization = `Bearer ${token}`
        ▼
  request goes out to the real backend (NEXT_PUBLIC_API_URL)
```

## Why not the old way?

The previous version of `lib/api.ts` kept a module-level `headers` object and a
`setAuth(token)` function that mutated it:

```ts
const headers = { Authorization: undefined };
export const setAuth = (token) => { headers.Authorization = `Bearer ${token}`; };
```

This is broken for two reasons:

1. **It's a global singleton on the server.** A Next.js server process handles many
   different users' requests concurrently. If any server code ever called `setAuth`,
   that token would leak into every other in-flight request on that process until
   something overwrote it again — a cross-user auth bug.
2. **Nothing called it.** The token from login was only ever stored inside NextAuth's
   own session/JWT — `setAuth` and the header object were dead code. Any service using
   `api` was silently sending unauthenticated requests.

The fix is to stop trying to cache/mutate the token ourselves and just ask NextAuth for
it, fresh, every time — see [`lib/api.ts`](../lib/api.ts).

## Where the token actually lives

`lib/auth.ts` configures NextAuth v5 (Auth.js) with a `Credentials` provider:

1. User submits email/password (`services/auth/auth.service.ts` → `signIn("credentials", …)`).
2. NextAuth calls `authorize()` in `lib/auth.ts`, which calls the local `login()`
   helper, which does `api.post("/auth", …, { skipAuth: true })` against the real
   backend.
3. The backend returns `{ userId, email, name, token }`. `authorize()` returns that as
   the NextAuth `user` object (`accessToken: token`).
4. The `jwt` callback copies `user.accessToken` onto the JWT (`token.accessToken`).
5. The `session` callback copies `token.accessToken` onto the session
   (`session.accessToken`).
6. NextAuth encrypts the JWT into an HTTP-only cookie. **That cookie is the only place
   the token is stored.**

Everything downstream (`auth()` on the server, `getSession()`/`useSession()` on the
client) just decrypts that cookie and hands back `session.accessToken`. `types/next-auth.d.ts`
is what makes `accessToken` a known field on `User` / `JWT` / `Session` in TypeScript —
if you add more fields to the backend's login response that you want on the client,
extend the same three interfaces there and thread them through the `jwt`/`session`
callbacks the same way `accessToken` is handled.

## The `api.ts` interceptor, step by step

```ts
api.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config;

    const token = await getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

`getAccessToken()` branches on `typeof window === "undefined"`:

- **Server** (Server Components, Server Actions, Route Handlers, `lib/auth.ts` itself):
  dynamically imports `@/lib/auth` and calls `auth()`. This reads the session cookie for
  *that specific request* via Next's request-scoped context — safe under concurrency,
  unlike the old global object.
- **Browser** (any `"use client"` component/service): dynamically imports
  `next-auth/react` and calls `getSession()`, which hits `GET /api/auth/session`.

Both branches funnel into the exact same `api` instance and the exact same header
attachment logic — callers (`services/whatsapp/whatsapp.service.ts`, etc.) don't need to
know or care which side they're running on.

**Why dynamic `import()` and not a top-level `import`?** `lib/auth.ts` already does a
*static* `import { api } from "@/lib/api"` (it needs `api` to call the login endpoint).
If `lib/api.ts` statically imported `lib/auth.ts` back, that's a circular module
dependency at load time. Because the import inside `getAccessToken()` is dynamic and
only runs *when a request is actually made* (long after both modules have finished
loading), the cycle is never a problem in practice — but don't "simplify" it to a static
import, it will break the build.

## Why `skipAuth`

`lib/auth.ts`'s `login()` calls `api.post("/auth", …, { skipAuth: true })`. Without that
flag, the interceptor would still run for the login request itself, call `auth()`, and
`auth()` would try to read a session that doesn't exist yet (you're in the middle of
creating one). It's harmless — you just get no `Authorization` header — but it's a
wasted async hop and confusing to read. `skipAuth` (declared via `declare module "axios"`
at the top of `lib/api.ts`) just short-circuits the interceptor for that one request.

Use `{ skipAuth: true }` for any other endpoint that is genuinely public (e.g. a
password-reset request, a public health check) and must never carry a stale/expired
token.

## How to add a new authenticated API call

You don't do anything auth-related. Just use `api` like any axios instance:

```ts
// services/example/example.service.ts
import { api } from "@/lib/api";

class ExampleService {
    async getThing(id: string) {
        const { data } = await api.get(`/example/${id}`);
        return data;
    }
}

export const exampleService = new ExampleService();
```

Call it from a server component, a route handler, a server action, or a `"use client"`
component — the bearer token is attached automatically based on wherever the code
actually runs. If the user isn't logged in, the request just goes out without a token
(same as any unauthenticated request) — handle a `401`/`403` response the same way you'd
handle any other backend error (`validateStatus` in `lib/api.ts` lets `400`–`404`
resolve instead of throwing, so check `resp.status`/`resp.data.success`).

## Known trade-offs / things to revisit later

- **`getSession()` on every client request costs a network round-trip** (`GET
  /api/auth/session`) before the real request even goes out. Fine for occasional calls;
  if some client component starts firing many `api` calls, consider wrapping the app in
  a `SessionProvider` and reading the token from `useSession()` in a small provider-level
  sync effect instead of calling `getSession()` per request. This app currently has no
  `SessionProvider` — `services/auth/auth.service.ts` uses `getSession()`/`signIn()`/`signOut()`
  directly, which works standalone without one.
- **No global 401 handling.** Because of `validateStatus`, an expired/invalid token
  results in a normal resolved response with `status: 401`, not a thrown error. Nothing
  currently forces a re-login/`signOut()` when that happens — callers must check for it
  themselves. Add a response interceptor in `lib/api.ts` if/when this needs to be
  centralized.
- **No route protection yet.** `proxy.ts` currently only handles locale routing;
  redirecting unauthenticated users away from `(dashboard)` routes (or guarding them with
  `auth()` in a layout) is separate work, not something `lib/api.ts`/`lib/auth.ts` does
  for you.
