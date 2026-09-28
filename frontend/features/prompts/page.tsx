import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: "Prompts",
        description: 'Pagina de inicio de prompts'
    };
}
export default function PromptsPage(){
    return(
        <div>

        </div>
    )
}