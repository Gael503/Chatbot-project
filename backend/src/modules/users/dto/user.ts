import { BaseResponse, Pagination } from "~/shared";
export class User{
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export class UserInfo{
    id: number;
    name: string;
    email: string;
    password: string;
}

interface UserCreateData {
    id_user: number;
}

export class userCreateRequest{
    name: string = "";
    email: string = "";
    password: string = "";
}

export class userCreateResponse extends BaseResponse<UserCreateData>{
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

export class userInfoResponse extends BaseResponse<UserInfo>{
    data: UserInfo = new UserInfo();
}
