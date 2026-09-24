import { Eraser ,Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IButtonsForm } from "./interfaces/buttonsForm"
import { useTranslations } from "next-intl"

export default function ButtonsForm(props: IButtonsForm){
    const { clean_label, submit_label, disable } = props;
    const t = useTranslations();
    return(
        <div className="w-full flex bg-none">
            <Button
                variant="default"
                type="reset"
                className="w-1/2 border-2 bg-red-400 hover:bg-blue-900 flex m-auto p-4 text-white cursor-pointer"
                disabled={disable}
            >
                <Eraser />
                { clean_label ? clean_label : t('forms.clean_btn') }
            </Button>
            <Button
                variant="default"
                type="submit"
                className="w-1/2 border-2 bg-blue-600 hover:bg-blue-900 flex m-auto p-4 text-white cursor-pointer"
                disabled={disable}
            >
                <Send />
                { submit_label ? submit_label : t('forms.send_btn') }
            </Button>
        </div>
    )
}