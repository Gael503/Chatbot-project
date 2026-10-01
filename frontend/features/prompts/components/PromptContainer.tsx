import { formatDate } from "@/components/utils/formatDate";
import { promptData } from "@/services/prompts/classes";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

export function PromptContainer(data: promptData){
    const { id, version_num, content, created_at } = data;
    const t = useTranslations();
    return(
        <div className="border border-gray-300 overflow-hidden my-4 bg-gray-200 py-1 px-3 pt-6">
            <p className="font-bold flex mb-2">
                <FileText className="mx-2"/>
                { t('prompt.instructions') }
            </p>
            <div className="bg-white rounded-t-2xl h-40 overflow-y-auto">
                <p className="p-2">
                    { content }
                </p>
            </div>
            {/* footer */}
            <div className="flex font-bold text-sm">
                <p className="m-2">
                    {t('prompt.current_version', { number: version_num })}
                </p>
                <p className="m-auto mr-0">Creado: {formatDate(created_at)}</p>
            </div>
        </div>
    )
}

export function PromptContainerEmpty(){
    return(
        <div className="border border-gray-300 overflow-hidden my-4 bg-gray-200 p-1 pt-6">
            <div className="bg-white rounded-t-2xl h-40 flex">
                <p className="p-2 m-auto font-bold">
                    Actualmente no hay un prompt activo,
                    Crea uno o activa alguna de las versiones ya creadas!
                </p>
            </div>
            {/* footer */}
            <div className="flex font-bold p-2">
            </div>
        </div>
    )
}