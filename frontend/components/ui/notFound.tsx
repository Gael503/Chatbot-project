import { CircleX } from "lucide-react"
import { useTranslations } from "next-intl"
export default function NotFound(props: {message?: string}){
    const t = useTranslations();
    return(
        <div className="w-full h-60 grid place-content-center p-3">
            <CircleX width={150} height={150} className="m-auto"/>
            <h2 className="m-auto font-bold"> { props.message ? props.message : t('common.not_found')} </h2>
        </div>
    )
}