# Search + paginated table feature pattern

How `features/Users` is built, so the same shape can be reused for the next
list/search screen (e.g. Chats). Reference implementation:
[`features/Users/pages/TableUsers.tsx`](../../features/Users/pages/TableUsers.tsx).

## The short version

A "table feature" is a client page that lets the user filter a list, see it
paginated, and page/resize through results — all driven by one server
search endpoint that returns both the rows and the pagination state. Every
piece of the stack (backend validator, DTO classes, service, page component)
mirrors the same field names, so there's no per-feature mapping layer beyond
what's described below.

```
UserColumns.tsx ───────┐
                        ▼
form (InputText + ButtonsForm) ──▶ TableUsers.tsx ──▶ userService.search() ──▶ POST /users/search
                        ▲                 │                                          │
                        └── infoRequest ◀─┴── setUsers/setInfoRequest ◀── userSearchResponse
                                                                                       │
                                                                        backend UserSearchSchema (validator)
```

## Files you create per feature (using `Products` as the example name)

1. **`services/<feature>/classes/<entity>.ts`** — the DTO/model classes:
   ```ts
   export class Product { id: number; name: string; /* ...fields */ }
   export class productSearchRequest {
     id?: number
     name?: string
     pagination: Pagination = new Pagination()
   }
   export class productSearchResult {
     products: Product[] = []
     pagination: Pagination = new Pagination()
   }
   export class productSearchResponse extends BaseResponse<productSearchResult> {}
   ```
   `Pagination` and `BaseResponse` come from `@/shared` — don't redefine them.
   Field names on the request class should match the backend validator schema
   exactly (see step 5) — the frontend intentionally does not rename fields
   between request and DTO.

2. **`services/<feature>/<feature>.service.ts`** — one class, one singleton:
   ```ts
   class ProductService {
     async search(payload: productSearchRequest): Promise<productSearchResponse> {
       try {
         const resp = await api.post<productSearchResponse>("/products/search", payload)
         return resp.data
       } catch {
         return new productSearchResponse()
       }
     }
   }
   export const productService = new ProductService()
   ```
   Register the singleton in `services/index.ts` alongside `userService`,
   `authService`, `whatsAppService`.

3. **`features/<Feature>/components/<Entity>Columns.tsx`** — column defs:
   ```ts
   const columnHelper = createColumnHelper<DataTableFeatures, Product>()
   export const productColumns = columnHelper.columns([
     columnHelper.accessor("name", { header: "Name" }),
     // ...
   ])
   ```
   `DataTableFeatures` comes from `components/table-features.ts` — always the
   first generic argument for both `createColumnHelper` and `ColumnDef`.

4. **`features/<Feature>/pages/Table<Feature>.tsx`** — the page itself. Copy
   `TableUsers.tsx` and adjust the four feature-specific spots:
   - the `cloneRequest` helper (same shape, just retyped to your request class)
   - the fields read out of `formValues` inside `handleSearch`
   - the `InputText` fields rendered in the filter form
   - `columns={productColumns}` / `data={products}` passed to `<DataTable />`

   Everything else — `searchUsers`-equivalent, `useEffect` initial load,
   `handlePageChange`, `handleSizeChange`, the `<DataTable pagination={...}>`
   prop wiring — is boilerplate, not feature logic. Don't improvise a
   different shape for it.

5. **Backend validator** — `backend/src/modules/<feature>/dto/<entity>.schema.ts`
   using express-validator, mirroring `user.schema.ts`'s `UserSearchSchema`:
   top-level filter fields optional, plus `pagination.page` (int ≥ 1, default
   1) and `pagination.size` (int 1-100, default 5). The backend response must
   echo back the resolved `pagination` (with `total`/`totalPages` filled in)
   inside `data`, because the frontend re-derives its next request state from
   that echoed value, not from what it sent.

## The parts worth understanding, not just copying

**`cloneRequest` exists because the request objects are class instances, not
plain objects.** `useForm`/React state updates need a new object each time,
but `Object.assign({}, request)` would strip the class prototype (losing
`Pagination`'s `offset` getter and `calculate()` method) and leave the nested
`pagination` field aliased to the old object. The pattern is always:
```ts
const next = Object.assign(new RequestClass(), request)
next.pagination = Object.assign(new Pagination(), request.pagination)
```

**`infoRequest` is rebuilt from the server response, not the outgoing
request.** After a successful search, `searchUsers` sets
`nextRequest.pagination = response.data.pagination` (server-calculated
`total`/`totalPages`), not the pagination it sent. `handlePageChange` /
`handleSizeChange` then clone *that* `infoRequest`, so paging always starts
from server-confirmed state.

**Page resets to 1 on every filter or size change**, but not on a plain page
change. `handleSearch` and `handleSizeChange` both set
`request.pagination.page = 1`; `handlePageChange` doesn't touch anything but
`page`.

**Field name translation happens once, at the `<DataTable>` call site.**
`Pagination` uses `page` / `size` / `total` / `totalPages`; `DataTable`'s
`pagination` prop uses `page` / `size` / `totalRecords` / `totalPages`
(`total` → `totalRecords`). This mapping is manual and lives only in the page
component — `DataTable` itself has no awareness of the domain `Pagination`
class.

**Loading state disables the pager, not the form.** `loading` is passed
straight into `DataTable`'s `pagination.loading`, which disables the
page/size controls while a request is in flight. `ButtonsForm`'s own
`disable` prop is separate and unused by `TableUsers.tsx` today — wire it to
`loading` too if you want the filter form to lock during a search.

## Known drift to avoid copying

`features/Users/components/UserSearch.tsx` and
`features/Users/interfaces/index.ts` (`userSearchProps`) are an older,
unused filter-form implementation (`@base-ui/react` inputs +
`handleFilterChange`/`handleSearch` props) that `TableUsers.tsx` no longer
calls — it builds its filter form inline with `InputText` + `ButtonsForm`
instead. Don't base a new feature on `UserSearch.tsx`; it's dead code left
over from a previous iteration of this pattern.

## Reference: shared pieces you should not reimplement

| Piece | Location | Notes |
|---|---|---|
| `Pagination` | `shared/Pagination.ts` | `page`, `size`, `total`, `totalPages`, `.offset` getter, `.calculate()` |
| `BaseResponse<T>` | `shared/BaseResponse.ts` | `{ code, message, success, data? }` envelope every `*Response` extends |
| `DataTable` | `components/ui/data-table.tsx` | TanStack Table v9 wrapper; renders rows + pager from the `pagination` prop |
| `DataTableFeatures` | `components/table-features.ts` | first generic arg for `ColumnDef`/`createColumnHelper` |
| `InputText` | `components/forms/customField.tsx` | react-hook-form `Controller` wrapper; validation via `fieldInfo` (`requeried`, `minlength`, `maxlength`) |
| `ButtonsForm` | `components/forms/buttonsForm.tsx` | reset + submit buttons, i18n labels, single `disable` prop |
| `api` | `lib/api.ts` | shared axios instance — see [`auth-and-api.md`](../auth-and-api.md) |
