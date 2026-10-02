import { api } from "@/lib/api";
import { botStatusResponse } from "./classes";
class WhaService{
    async getQr(){
        try {
            const resp = await api.get("/whatsapp/qr",{
                responseType: "blob"
            })
            return resp.data;
        } catch (error) {
            return null;
        }
    }

    async getStatus(){
        let statusResponse = new botStatusResponse();
        try {
            const resp = await api.get<botStatusResponse>("/whatsapp/status")
            statusResponse = resp.data;
            return statusResponse;
        } catch (error) {
            return statusResponse;
        }
    }
}

export const whatsAppService = new WhaService();