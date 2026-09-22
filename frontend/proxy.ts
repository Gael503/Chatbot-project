import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import type { Session } from "next-auth";
import { auth } from "./lib/auth";
declare module "next/server" {
    interface NextRequest {
        auth?: Session | null;
    }
}
const locales = ["en", "es"];
const intlMiddleware = createMiddleware(routing);

const publicRoutes = ["/login"];
//funciones auxiliares
function isPublicRoute(pathname: string) {
    const segments = pathname.split("/");
    const locale: string = segments[1];

    const cleanPath = locales.includes(locale) ? `/${segments.slice(2).join("/")}` : pathname;
    return publicRoutes.some((route) =>
        cleanPath === route ||
        cleanPath.endsWith(route) ||
        cleanPath.startsWith(`${route}/`)
    );
}
export default auth((req: NextRequest) => {

    const session = req.auth;
    const pathname = req.nextUrl.pathname;

    const isPublic= isPublicRoute(pathname);
    if (pathname === "/" || pathname === `/es` || pathname === `/en`) {
        // console.log("No hay una ruta concreta");
        const path = session ? "/home" : "login"
        return NextResponse.redirect(
            new URL(path, req.url)
        );
    }
    // No hay sesión y quiere entrar a una ruta protegida
    if (!session && !isPublic) {
        // console.log("No hay session enviando a login");
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Hay sesión y quiere entrar a una ruta pública
    if (session && isPublic) {
        // console.log("Ya hay una session activa");
        const homeUrl = new URL("/home", req.url);
        return NextResponse.redirect(homeUrl);
    }

    // Todo normal
    return intlMiddleware(req);
});

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};