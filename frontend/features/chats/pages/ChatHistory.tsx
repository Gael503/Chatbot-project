"use client"
import { SquareUser } from "lucide-react"
import { Input } from "@base-ui/react/input"
import { BotMessage, UserMessage } from "../components/Messages"

import { chatService } from "@/services/chats/chats.service"
import { HistoryRequest, HistoryResponse, Messages } from "@/services/chats/classes"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import { Loader } from "@/components/ui/loader"
import Pagination from "@/shared/Pagination"
import { Button } from "@base-ui/react/button"

const SCROLL_TOP_THRESHOLD = 40;

function cloneRequest(request: HistoryRequest): HistoryRequest {
    const next = Object.assign(new HistoryRequest(request.idContact), request)
    next.pagination = Object.assign(new Pagination(), request.pagination)
    return next
}

export default function ChatHistoryPage(){
    const params = useParams<{ id: string }>();
    const idContact = Number(params.id);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [phone, setPhone] = useState<string>("Unknow")
    const [infoRequest, setInfoRequest] = useState<HistoryRequest>(new HistoryRequest(idContact));
    const defaultValues = new HistoryRequest(idContact);

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<HistoryRequest>({ defaultValues })

    const containerRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number | null>(null);
    const scrollToBottomRef = useRef<boolean>(false);

    const getMessages = async (request: HistoryRequest) =>{
        setLoading(true)
        try {
            const resp: HistoryResponse = await chatService.history(request);
            if(!resp.success || !resp.data){
                console.log("Contactos no disponibles");
                return;
            }
            scrollToBottomRef.current = true;
            setMessages([...resp.data.messages].reverse())
            setPhone(resp.data.phone || "Unknow")
            setInfoRequest(Object.assign(cloneRequest(request), {
                pagination: Object.assign(new Pagination(), resp.data.pagination)
            }))
        } catch (error) {
            setMessages([])
        } finally {
            setLoading(false)
        }
    }

    const loadOlderMessages = async () => {
        const { pagination } = infoRequest;
        if (loading || loadingMore || pagination.page >= pagination.totalPages) return;

        setLoadingMore(true)
        prevScrollHeightRef.current = containerRef.current?.scrollHeight ?? null;
        try {
            const request = cloneRequest(infoRequest)
            request.pagination.page = pagination.page + 1
            const resp: HistoryResponse = await chatService.history(request);
            if(!resp.success || !resp.data){
                return;
            }
            const olderMessages = [...resp.data.messages].reverse()
            setMessages((current) => [...olderMessages, ...current])
            setInfoRequest(Object.assign(cloneRequest(request), {
                pagination: Object.assign(new Pagination(), resp.data.pagination)
            }))
        } finally {
            setLoadingMore(false)
        }
    }

    useEffect(() =>{
        defaultValues.pagination.size = 10;
        getMessages(defaultValues)
    },[idContact])

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prevScrollHeight = prevScrollHeightRef.current;
        if (prevScrollHeight !== null) {
            container.scrollTop = container.scrollHeight - prevScrollHeight;
            prevScrollHeightRef.current = null;
        } else if (scrollToBottomRef.current && !loading) {
            container.scrollTop = container.scrollHeight;
            scrollToBottomRef.current = false;
        }
    }, [messages, loading])

    const handleScroll = () => {
        const container = containerRef.current;
        if (container && container.scrollTop <= SCROLL_TOP_THRESHOLD) {
            loadOlderMessages();
        }
    }

    return (
        <div>
            <header className="border-b-2 border-gray-200 p-2 flex">
                <SquareUser width={50} height={50}/>
                <p className="my-auto font-bold">
                    { phone }
                </p>
            </header>
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="border-2 border-gray-300 my-4 w-full overflow-y-scroll h-140 p-2 flex flex-col"
            >
                {
                    loadingMore && <Loader />
                }
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
            <div className="flex justify-end">
                <Input placeholder="Escribe un mensaje...." className="p-3 border border-gray-400 w-84" disabled/>
                <Button className="bg-blue-500 px-4 rounded-2xl m-2 text-white" disabled>
                    Enviar
                </Button>
            </div>
        </div>
    )
}
