import type { User } from "next-auth";
import { AppBreadcrumb } from "./app-breadcrumb";
import { authService } from "@/services/auth/auth.service"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { formatTime } from "../utils/formatDate";
export default function Header({ onMenuClick }: { onMenuClick: () => void }){
    const [user, setUser] = useState<User | null>(null);
    const [date,setDate] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(true);
    const getSession = async () =>{
        try {
            const resp = await authService.getCurrentSession();
            if(!resp) return;
            const { user, expires } = resp;
            setDate(formatTime(String(expires)))
            setUser(user as User)
        } catch (error) {
            console.log("Error: ", error);
        }finally{
            setLoading(false)
        }
    }
    useEffect(() =>{
        getSession();
    },[])
    return(
        <header className="flex h-15 items-center gap-4 border-b border-gray-100 px-4 mb-4">
            <Button
                className="cursor-pointer p-2 md:hidden"
                onClick={onMenuClick}
            >
                <Menu />
            </Button>
            <div className="m-auto ml-0">
                <AppBreadcrumb />
            </div>
            {!loading ? (
                <div className="grid">
                    <div className="flex items-center gap-2 m-auto mr-0">
                        <span className="font-bold text-sm text-muted-foreground hidden sm:block">
                            { user?.name ?? "User Test"}
                        </span>
                        <Avatar className="size-8">
                            <AvatarImage src="/botlogo.png" alt="user_profile" className="grayscale" />
                        </Avatar>
                    </div>
                    <div>
                        <span className="font-bold text-sm text-muted-foreground hidden sm:block">
                            { date && `Session expira en: ${date}`}
                        </span>
                    </div>
                </div>
            ): <>Loading...</>}
        </header>
    )
}