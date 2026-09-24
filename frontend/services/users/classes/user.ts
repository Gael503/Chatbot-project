import { BaseResponse, Pagination } from "@/shared";

export class User{
    id: number = 0;
    name: string = "";
    email: string = "";
    created_at: Date = new Date();
    updated_at: Date = new Date();
    is_active: boolean = false;
    last_login: Date = new Date();
}

export class userCreateRequest{
    name: string = "";
    email: string = "";
    password: string = "";
}

export class userCreateResponse extends BaseResponse<{id_user: number}>{
    constructor(){
        super();
        this.data = {
            id_user: 0
        }
    }
}

export class userSearchRequest {
    id: number = 0;
    name: string = "";
    email: string = "";
    pagination: Pagination = new Pagination();
}

export class userSearchResult {
    users: User[] = [];
    pagination: Pagination = new Pagination();
}

export class userSearchResponse extends BaseResponse<userSearchResult>{
    constructor(){
        super();
        this.data = new userSearchResult();
    }
}