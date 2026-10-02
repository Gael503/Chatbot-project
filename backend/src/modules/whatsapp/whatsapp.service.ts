import { ResponseProps, BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { botStatusResponse } from "./dto/whatsapp";
import { Http_codes } from "~/utils/Constants";
import logger from "~/lib/logger";
import BotStatus from "~/bot/status";

class WhatsAppService{

    async status(): Promise<botStatusResponse>{
        let statusResponse: botStatusResponse = new botStatusResponse();
        try {
            const status = BotStatus.getInstance().getStatus();
            statusResponse.setSuccessResponse({
                message: "Status del bot solicitado",
                data: status
            })
            return statusResponse;
        } catch (error: any) {
            statusResponse = HandleErrors(this.status.name, error) as botStatusResponse
            return statusResponse;
        }finally{
            WriteEndService(this.status.name, statusResponse)
        }
    }
}

export const whatsAppService = new WhatsAppService();
