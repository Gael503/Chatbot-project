import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import logger from "~/lib/logger";
import { Http_codes } from "~/utils/Constants";

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