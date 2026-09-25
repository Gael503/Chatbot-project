import { Bot, User } from "lucide-react"
import { messageData } from "../interfaces"
import { Messages } from "@/services/chats/classes"

export function BotMessage(object: Messages){
    const { content, created_at } = object;
    return(
        <div className="flex mx-4 my-2 justify-end">
            <div className="mr-2 border w-1/4 p-2 rounded-b-md rounded-tl-md bg-blue-300">
                { content }
                <p className="text-sm font-bold m-1"> {created_at} </p>
            </div>
            <Bot className="border rounded-2xl mr-0" width={30} height={30}/>
        </div>
    )
}

export function UserMessage(object: Messages){
    const { content, created_at } = object;
    return(
        <div className="flex mx-4 my-2">
            <User className="border rounded-2xl" width={30} height={30}/>
            <div className="ml-2 border w-1/4 p-2 rounded-b-md rounded-tr-md bg-emerald-200">
                { content }
                <p className="text-sm font-bold m-1 text-end"> { created_at } </p>
            </div>
        </div>
    )
}