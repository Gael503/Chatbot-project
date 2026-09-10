import { BaseResponse } from "./BaseResponse";
import logger from "~/lib/logger";
export const WriteInitService = (functionName: string): void => logger.info(functionName + " - Service Start")
export const WriteEndService = (functionName: string, response: BaseResponse | any): void => {
    logger.info(functionName + " - Service End")
    logger.info("Final response: ")
    logger.info(response)
}
