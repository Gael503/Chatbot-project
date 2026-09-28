import { BaseResponse } from "./BaseResponse";
import logger from "~/lib/logger";
export const WriteInitService = (functionName: string): void => logger.info(functionName + " - Service Start")
export const WriteEndService = (functionName: string, response: BaseResponse | any): void => {
    logger.info(functionName + " - Service End")
    logger.info("Final response: ")
    logger.info(response)
}

//ayuda a censurar x propiedad en el objeto que envies, indica el campo
const hideField = (obj: any, field: string) => {
    if (typeof obj[field] === "string") {
        obj[field] = `${obj[field].slice(0, 8)}...`;
    }
};

export const WriteSensitiveData = async (data: any) => {
    const tempData = { ...data };
    hideField(tempData, "password")
    logger.info(tempData)
}