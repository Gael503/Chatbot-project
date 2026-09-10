import logger from "~/lib/logger";
import { BaseResponse } from "./BaseResponse";

export default function HandleErrors(functionName: string, error: any): BaseResponse{
    const response = new BaseResponse();
    logger.error(`[Error in function ${functionName}]`)
    logger.error(`Message: ` + error.message)
    response.setErrorResponse();
    return response;
}