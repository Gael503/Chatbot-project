import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Home from "./pages/Home";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: "WhatsApp",
        description: 'Pagina de inicio wa'
    };
}
export default function WhatsAppPage(){
    return(
        <div>
            <Home />
        </div>
    )
}