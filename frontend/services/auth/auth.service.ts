import { LoginForm } from "@/components/forms/interfaces/login";
import { signIn, getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";

class AuthService{
    async login(payload: LoginForm): Promise<any>{
        try {
            const existSession = await this.getCurrentSession();
            // session activa.
            if(existSession) return existSession;
            
            const { email ,password } = payload;
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            })
            if(result?.error){
                return null
            }
            return await this.getCurrentSession();
        } catch (error) {
            console.log("Error: ");
            console.log(error);
        }
    }

    async getCurrentSession(): Promise<Session | null>{
        const session: Session | null = await getSession();
        console.log("Session: ", session)
        if(!session) return null;
        return session;
    }

    async logout() {
        await signOut({
            redirect: true,
            redirectTo: "/login"
        });
    }
}

export const authService = new AuthService();