import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TableUsers from "./pages/TableUsers";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: "Users",
        description: 'Pagina de inicio usuarios'
    };
}
export default function UsersPage(){
    return(
        <div>
            <TableUsers />
        </div>
    )
}