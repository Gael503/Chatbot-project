import { BaseResponse } from "~/shared";

export class LoginRequest{
    email: string = "";
    password: string = "";
}

export class LoginResponse extends BaseResponse<{token: string}>{
    constructor(){
        super();
        this.data = {
            token: ""
        }
    }
}