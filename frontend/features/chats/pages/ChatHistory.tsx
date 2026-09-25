"use client"
import { SquareUser } from "lucide-react"
import { Input } from "@base-ui/react/input"
import { BotMessage, UserMessage } from "../components/Messages"

import { chatService } from "@/services/chats/chats.service"
import { HistoryRequest, HistoryResponse, Messages } from "@/services/chats/classes"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { Loader } from "@/components/ui/loader"

export default function ChatHistoryPage(){
    const params = useParams<{ id: string }>();
    const idContact = Number(params.id);
    const [loading, setLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [phone, setPhone] = useState<string>("Unknow")
    const defaultValues = new HistoryRequest(idContact);

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<HistoryRequest>({ defaultValues })
    const getMessages = async (request: HistoryRequest) =>{
        setLoading(true)
        try {
            const resp: HistoryResponse = await chatService.history(request);
            if(!resp.success){
                console.log("Contactos no disponibles");
                return;
            }
            setMessages(resp.data?.messages ?? [])
            setPhone(resp.data?.phone ?? "Unknow")
        } catch (error) {
            setMessages([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() =>{
        getMessages(defaultValues)
    },[])
    return (
        <div>
            <header className="border-b-2 border-gray-200 p-2 flex">
                <SquareUser width={50} height={50}/>
                <p className="my-auto font-bold">
                    { phone }
                </p>
            </header>
            <div className="border-2 border-gray-300 my-4 w-full overflow-y-scroll h-140 p-2 flex flex-col">
                {
                    loading && <Loader />
                }
                {
                    !loading && (
                        messages.length ? (
                            messages.map((message, index) =>{
                                return message.response_from === "User" ? <UserMessage key={index} {...message} /> : <BotMessage key={index} {...message}/>
                            })
                        ) : <p> Mensajes no disponibles</p>
                    )
                }
            </div>
            {/* Simular que se puede enviar mensaje */}
            <div className="">
                <Input placeholder="Escribe un mensaje...." className="p-3 border border-gray-400 w-84" />
            </div>
        </div>
    )
}