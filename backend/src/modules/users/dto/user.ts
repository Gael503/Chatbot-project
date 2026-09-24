import { BaseResponse, Pagination } from "~/shared";
//representacion
export class UserEntity{
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    last_login: Date;
}
export class User{
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    is_active: boolean;
    last_login: Date;
}

export class UserInfo{
    id: number;
    name: string;
    email: string;
    password: string;
    is_active: boolean;
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
        this.data = {
            users: [],
            pagination: new Pagination()
        }
    }
}

export class userInfoResponse extends BaseResponse<UserInfo>{
    data: UserInfo = new UserInfo();
}
