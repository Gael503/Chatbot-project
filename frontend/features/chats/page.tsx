import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ChatsHome from "./pages/ChatsHome";
import ChatHistory from "./pages/ChatHistory";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: "Contactos",
        description: 'Pagina de inicio contactos'
    };
}
export default function ContactsPage(){
    return(
        <div>
            <ChatHistory />
        </div>
    )
}