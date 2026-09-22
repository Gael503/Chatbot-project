import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/services/auth/classes";
import { Http_codes } from "@/shared/Constants";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const MAX_AGE = Number(process.env.MAX_AGE) || 60 * 30; // seconds; jwt.maxAge is in seconds

async function login(credentials: LoginRequest): Promise<LoginResponse> {
    let loginResponse = new LoginResponse();
    try {
        const { data } = await api.post<LoginResponse>("/auth", {
            email: credentials.email,
            password: credentials.password,
        });
        loginResponse = data;
    } catch(error) {
        throw new Error("Cannot make login correctly try more later");
    }
    return loginResponse;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const resp = await login({
                    email: String(credentials.email),
                    password: String(credentials.password),
                });

                if (!resp.success || !resp.data) {
                    return null;
                }

                const { userId, email, name, token } = resp.data;

                return {
                    id: String(userId),
                    name,
                    email,
                    accessToken: token
                };
            },
        }),
    ],
    secret: NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: MAX_AGE },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }

            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: { signIn: "/login" },
});
