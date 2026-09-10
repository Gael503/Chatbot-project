import { BaseResponse } from "~/shared";

export class LoginRequest{
    email: string = "";
    password: string = "";
}

export class LoginResponse extends BaseResponse<{userId: number, name: string, email: string}>{
    constructor(){
        super();
        this.data = {
            userId: 0,
            name: "",
            email: "",
        }
    }
}
