import { Phone, ContactRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { ContactData } from "../interfaces";
import { formatDate } from "@/components/utils/formatDate";
export default function CardContact(props: ContactData){
    const { id, phone, created_at } = props;
    const router = useRouter();
    return(
        <div
            className="card w-48 border rounded-2xl bg-white p-3 m-4 shadow-md cursor-pointer hover:shadow-2xl hover:bg-gray-100 overflow-auto"
            key={id}
            onClick={() => router.push(`/chats/${id}`)}
        >
            <div className="flex flex-col">
                <ContactRoundIcon height={80} width={80} className="m-auto"/>
                <span className="flex justify-center align-middle p-2">
                    <Phone className="mr-1"/>
                    <strong className="my-auto">{phone}</strong>
                </span>
                <div className="m-auto">
                    <p>Creado: </p>
                    <p className="font-bold text-sm">{ formatDate(created_at) }</p>
                </div>
            </div>
        </div>
    )
}