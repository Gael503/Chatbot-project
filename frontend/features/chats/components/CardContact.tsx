import { Phone, ContactRoundIcon, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { ContactData } from "../interfaces";
import { formatDate } from "@/components/utils/formatDate";
import { useTranslations } from "next-intl";

export default function CardContact(props: ContactData){
    const { id, phone, created_at } = props;
    const t = useTranslations();
    const router = useRouter();
    return(
        <div
            className="w-48 max-h-38 rounded-2xl bg-gray-50 sm:my-10 md:m-auto xl:m-4 cursor-pointer hover:shadow-2xl hover:bg-gray-100"
            key={id}
            onClick={() => router.push(`/chats/${id}`)}
        >
            <div>
                <ContactRoundIcon height={100} width={100} className="m-auto"/>
            </div>
            <div className="overflow-hidden h-full">
                <div className="bg-gray-100 overflow-hidden rounded-b-2xl p-1 h-full hover:bg-gray-200">
                    <div className="flex p-2">
                        <Phone className="mx-2"/>
                        <p className="font-bold text-sm"> {phone} </p>
                    </div>

                    <div className="flex p-2 my-2">
                        <Calendar className="mx-2"/>
                        <p className="font-bold text-sm"> { formatDate(created_at) } </p>
                    </div>
                </div>
            </div>
        </div>
    )
}