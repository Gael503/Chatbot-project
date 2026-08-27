import { Http_codes, Success_message, Error_message } from "~/utils/Constants";
export interface ResponseProps {
    code: number;
    message: string;
    data: any
}
export class BaseResponse{
    code: number = Http_codes.bad_request;
    message: string = "";
    success: boolean = false;
    data?: any;

    false_response(props?: ResponseProps){
        const { code, message } = props;
        this.code = code ?? Http_codes.bad_request;
        this.message = message ?? Error_message;
    }

    success_response(props?: ResponseProps){
        const { code, message, data } = props;
        this.success = true;
        this.code = code ?? Http_codes.success;
        this.message = message ?? Success_message;
        this.data = data ?? null;
    }
}