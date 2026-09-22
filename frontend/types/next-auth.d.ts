import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {

    interface User {
        accessToken: string;
    }

    interface Session {
        accessToken?: string;
        expires: Date;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        id?: string;
        name?: string | null;
        email?: string | null;
        accessToken?: string;
    }
}