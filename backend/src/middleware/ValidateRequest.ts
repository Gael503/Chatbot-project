import { Request, Response, NextFunction } from "express";
import { BaseResponse } from "~/shared";
import * as z from "zod";
import logger from "~/lib/logger";

export const validateBody = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);
        if (!result.success) {
            logger.warn("Parametros invalidos")
            const response = new BaseResponse();
            response.setErrorResponse({
                code: 400,
                message: "Datos inválidos",
                data: result.error.flatten()
            })
            return res.status(response.code).json(response);
        }

        req.body = result.data;

        next();
    };
};