import { ResponseProps, BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { HistoryRequest, HistoryResponse, ContactsRequest, ContactResponse, HistoryEntity, Messages } from "./dto/chat";
import { getContacts, getHistory } from "./chats.respository";
import { Http_codes } from "~/utils/Constants";
import logger from "~/lib/logger";
class ChatService{

    async Contacts(payload: ContactsRequest): Promise<ContactResponse>{
        WriteInitService(this.Contacts.name)
        let contactsResponse = new ContactResponse();
        try {
            const pagination = Object.assign(new Pagination(), payload.pagination);
            payload.pagination = pagination;
            const contacts = await getContacts(payload);
            if(!contacts.length){
                contactsResponse.setErrorResponse({code: Http_codes.not_found, message: "No se encontraron contactos", data: []})
                return contactsResponse;
            }
            contactsResponse.setSuccessResponse({message: "Contactos Obtenidos", data: contacts})
            return contactsResponse;
        } catch (error: any) {
            contactsResponse = HandleErrors(this.Contacts.name, error) as ContactResponse;
            return contactsResponse;
        } finally{
            WriteEndService(this.Contacts.name, contactsResponse)
        }
    }

    async History(payload: HistoryRequest): Promise<HistoryResponse>{
        WriteInitService(this.History.name)
        let historyResponse = new HistoryResponse();
        try {
            const pagination = Object.assign(new Pagination(), payload.pagination);
            payload.pagination = pagination;
            const { history, total } = await getHistory(payload);
            if(!history.length){
                historyResponse.setErrorResponse({code: Http_codes.not_found, message: "No se encontro historial relacionado", data: []})
                return historyResponse;
            }
            //armar los mensajes
            const messages = await this.DefineTypeMessage(history);
            pagination.total = total;
            pagination.calculate();
            historyResponse.pagination = pagination;
            historyResponse.setSuccessResponse({message: "Historial recuperado", data: messages})
            return historyResponse;
        } catch (error: any) {
            historyResponse = HandleErrors(this.History.name, error) as HistoryResponse;
            return historyResponse;
        } finally{
            WriteEndService(this.History.name, historyResponse)
        }
    }
    async DefineTypeMessage(messages: HistoryEntity[]): Promise<Messages[]>{
        //identificar si es bot o user
        const keywords = ["ans", "key"]
        const finalMessage: Messages[] = [];
        messages.map((i: HistoryEntity) =>{
            finalMessage.push({
                response_from: keywords.includes(i["keyword"].slice(0,3)) ? "Bot" : "User",
                content: i["answer"],
                created_at: i["created_at"]
            })
        })
        return finalMessage;
    }

}

export const chatService = new ChatService();