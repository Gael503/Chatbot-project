import LoaderPage from "@/components/ui/loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirectPage(){
    const router = useRouter();
    useEffect(() =>{
        //logica para validar si hay session
        const validateSession = async () =>{
            router.push("/home")
        }
        validateSession();
    },[])
    return (
        <>
            <LoaderPage />
        </>
    )
}