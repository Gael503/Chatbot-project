import axios from "axios";
declare module "axios" {
    export interface AxiosRequestConfig {
        /** Skip attaching the session bearer token (e.g. the login request itself). */
        skipAuth?: boolean;
    }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
    //dejar pasar los codigos de error que mande el be
    validateStatus: (status: number) => status >= 200 && status < 300 || status >= 400 && status <= 404
})

// Token always comes fresh from the NextAuth session — never store it in module state,
// since on the server that state would be shared across every user's concurrent request.
async function getAccessToken(): Promise<string | undefined> {
    if (typeof window === 'undefined') {
        const { auth } = await import('@/lib/auth');
        const session = await auth();
        return session?.accessToken;
    }

    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    return session?.accessToken;
}

api.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config;

    const token = await getAccessToken();
    if (token) config.headers.Authorization = `bearer ${token}`;
    return config;
});