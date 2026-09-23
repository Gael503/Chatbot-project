import { api } from "@/lib/api";
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
}

export const whatsAppService = new WhaService();