import { Pagination, BaseResponse } from "@/shared";

export class Contact{
    id: number = 0;
    phone: string = "";
    created_at: string = "";
    updated_at: string = "";
    last_interaction: string = "";
}
export class ContactsRequest{
    id?: number;
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
    last_interaction?: Date;
    pagination: Pagination = new Pagination();
}

export class contactSearchResult {
    contacts: Contact[] = [];
    pagination: Pagination = new Pagination();
}

export class ContactResponse extends BaseResponse<contactSearchResult>{
    constructor(){
        super();
        this.data = new contactSearchResult();
    }
}

export class HistoryRequest{
    idContact: number;
    pagination: Pagination = new Pagination();
    constructor(id_contact: number){
        this.idContact = id_contact;
    }
}

export class Messages {
    response_from : "User" | "Bot" = "User";
    content: string = "";
    created_at: string = "";

}
export class messagesHistoryResult {
    messages: Messages[] = [];
    pagination: Pagination = new Pagination();
}

export class HistoryResponse extends BaseResponse<messagesHistoryResult>{
    constructor(){
        super();
        this.data = {
            messages: [],
            pagination: new Pagination()
        }
    }
}