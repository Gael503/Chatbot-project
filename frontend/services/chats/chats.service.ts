import { api } from "@/lib/api";
import { ContactsRequest ,ContactResponse, HistoryRequest, HistoryResponse } from "./classes";
class ChatsService{
    async search(payload: ContactsRequest): Promise<ContactResponse>{
        let responseContacts = new ContactResponse();
        try {
            const resp = await api.post<ContactResponse>("/chats", payload)
            responseContacts = resp.data;
            return responseContacts;
        } catch (error) {
            return responseContacts;
        }
    }

    async history(payload: HistoryRequest): Promise<HistoryResponse>{
        let responseContacts = new HistoryResponse();
        try {
            const resp = await api.post<HistoryResponse>("/chats/history", payload)
            responseContacts = resp.data;
            return responseContacts;
        } catch (error) {
            return responseContacts;
        }
    }
}

export const chatService = new ChatsService();