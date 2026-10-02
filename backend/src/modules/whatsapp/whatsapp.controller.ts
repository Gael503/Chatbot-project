import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import logger from "~/lib/logger";
import { Http_codes } from "~/utils/Constants";
import { HandleErrors } from "~/shared";
import { whatsAppService } from "./whatsapp.service";
import { botStatusResponse } from "./dto/whatsapp";
export const GetQr = async (req: Request, res: Response): Promise <Response> =>{
    const qrPath = path.resolve("bot.qr.png");
    logger.info("Solicitando qr")
    if (!fs.existsSync(qrPath)) {
        logger.error("Error al solicitar qr")
        return res.status(Http_codes.not_found).json({
            message: "QR no disponible"
        });
    }
    res.status(Http_codes.success).sendFile(qrPath);
}

export const GetStatus = async (req: Request, res: Response): Promise<Response> => {
    let statusResponse: botStatusResponse = new botStatusResponse();
    try {
        statusResponse = await whatsAppService.status();
    } catch (error: any) {
        statusResponse = HandleErrors(GetStatus.name, error) as botStatusResponse;
    }
    return res.status(statusResponse.code).json(statusResponse);
}