import { Http_codes, Success_message, Error_message } from "~/utils/Constants";
export interface ResponseProps<T = any> {
    code?: number;
    message?: string;
    data?: any;
}
export class BaseResponse<T = any>{
    code: number;
    message: string;
    success: boolean;
    data?: T;

    constructor(){
        this.code = Http_codes.bad_request
        this.message = "";
        this.success = false;
    }

    setErrorResponse(props: ResponseProps = {}) {
        this.success = false;
        this.code = props.code ?? Http_codes.bad_request;
        this.message = props.message ?? Error_message;
        this.data = props.data ?? null;
    }

    setSuccessResponse(props: ResponseProps = {}) {
        this.success = true;
        this.code = props.code ?? Http_codes.success;
        this.message = props.message ?? Success_message;
        this.data = props.data ?? null;
    }
}