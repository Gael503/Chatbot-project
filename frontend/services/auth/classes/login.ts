import { BaseResponse } from "@/shared/BaseResponse";

export class LoginRequest{
    email: string = "";
    password: string = "";
}
export class loginData {
    userId: number = 0;
    name: string = "";
    email: string = "";
    token: string = "";
}
export class LoginResponse extends BaseResponse<loginData>{
    constructor(){
        super();
        this.data = {
            userId: 0,
            name: "",
            email: "",
            token: ""
        }
    }
}