import { Http_codes } from "./Constants";

export class BaseResponse<T = any>{
    code: number = Http_codes.bad_request;
    message: string = "";
    success: boolean = false;
    data?: T;
}