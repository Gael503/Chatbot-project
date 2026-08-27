import { Http_codes, Success_message, Error_message } from "~/utils/Constants";
export interface ResponseProps {
    code?: number;
    message?: string;
    data?: any;
}
export class BaseResponse{
    code: number = Http_codes.bad_request;
    message: string = "";
    success: boolean = false;
    data?: any;

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