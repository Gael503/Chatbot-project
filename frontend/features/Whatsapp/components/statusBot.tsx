
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/components/utils/formatDate";
import { StatusBotProps } from "../interfaces";
import NotFound from "@/components/ui/notFound";
import { useTranslations } from "next-intl";

export default function StatusBot({ loading, error, status, connectionData }: StatusBotProps){
    const t = useTranslations();
    return(
        <div className="w-full m-auto p-4 rounded-2xl xl:w-2/3">
            {
                loading && <Loader />
            }
            {
                !loading && (
                    error ? (
                        <NotFound message={t('common.service_fail')}/>
                    ) : (
                        <div className="flex flex-col md:flex-row">
                            <div className="m-auto md:mx-2">
                                {status?.icon}
                            </div>
                            <div className="w-full m-auto ml-0">
                                <div className="flex my-4">
                                    <p className="my-auto mr-2">{ t('whatsapp.card_status.status') }:</p>
                                    <p className={`m-auto ml-0 border px-4 ${status?.border || "border-2"} rounded-2xl font-bold`} >{status?.text}</p>
                                </div>
                                <div>
                                    {
                                        connectionData.host && (
                                            <>
                                                <p className="my-2">
                                                    {t('whatsapp.card_status.phone', { phone: connectionData.host.phone })}
                                                </p>

                                                <p className="my-2 font-bold">
                                                    {t('whatsapp.card_status.updated', { date: formatDate(connectionData.updatedAt) || "" })}
                                                </p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                )
            }

        </div>
    )
}