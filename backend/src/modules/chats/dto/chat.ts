import { BaseResponse, Pagination } from "~/shared";

export class ContactEntity{
    id: number;
    phone: string;
    created_at: Date;
    updated_at: Date;
    last_interaction: Date;
}

export class HistoryEntity{
    ref: string;
    keyword: string;
    answer: string;
    created_at: Date;
    contact_id: number;
}

export class ContactsRequest extends ContactEntity{
    pagination: Pagination = new Pagination();
}

export class ContactResponse extends BaseResponse<ContactEntity[]>{
    constructor(){
        super();
        this.data = []
    }
}

export class HistoryRequest{
    idContact: number;
    //probablemente necesitare paginacion...
    pagination: Pagination = new Pagination();
}
export class Messages {
    response_from : "User" | "Bot";
    content: string;
    created_at: Date;

}
export class HistoryResponse extends BaseResponse<Messages[]>{
    pagination: Pagination;
    constructor(){
        super();
        this.data = []
        this.pagination = new Pagination();
    }
}