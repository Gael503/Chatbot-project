import { Request, Response, NextFunction } from "express";
import { BaseResponse } from "~/shared";
import { ValidationChain, validationResult } from "express-validator";
import logger from "~/lib/logger";

export const validateBody = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn("Parametros invalidos")
            logger.info(errors.array())
            const response = new BaseResponse();
            response.setErrorResponse({
                code: 400,
                message: "Datos inválidos",
                data: errors.array()
            })
            return res.status(response.code).json(response);
        }

        next();
    };
};