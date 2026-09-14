
import config from "config"
import { Request, Response, NextFunction } from "express"
import { sendAuthError, sendAuthTokenError } from "~/modules/auth/utils/responses";
import jwt from 'jsonwebtoken';
import logger from "~/lib/logger";
import { TokenProperties, internal_process } from "~/modules/interfaces";
import { cacheService } from "~/modules/cache/user-cache.service";
const secret: string = config.get("jwt.secret")
const publicsPath = ["auth"]

declare global {
    namespace Express {
        interface Request {
            internal_process?: internal_process
        }
    }
}
const cleanPath = (path: string) => {
    const full_path = path.slice("/api/".length)
    //siempre devolvemos el path principal despues de api
    return full_path.split("/")[0]
}
//revisa cache del server para no volver a hacer una peticion a bd - sino existe va y consulta
const validateUser = async (req: Request, res: Response, token: TokenProperties): Promise<boolean> => {

    const cached: internal_process | null = await cacheService.get(token.email, token.userId);

    if (!cached) {
        logger.warn("User not found / inactive");
        //remover cache en caso de error
        cacheService.delete(token.email)
        return false;
    }

    req.internal_process = {
        email: cached.email,
        user_id: cached.user_id
    };

    return true;
};

export const ValidateToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!secret) throw new Error("JWT secret not configured!");

    const path = cleanPath(req.path);

    if (publicsPath.includes(path)) {
        logger.info("Path publico");
        return next();
    }

    const auth = req.headers.authorization;

    if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
        logger.warn("Missing bearer token");
        return sendAuthError(res);
    }

    const token = auth.slice("bearer ".length).trim();
    if (!token) return sendAuthError(res);

    try {

        const decoded: any = jwt.verify(token, secret);

        if (!decoded || typeof decoded !== "object") {
            logger.warn("Invalid token");
            return sendAuthTokenError(res);
        }

        logger.info({ decoded }, "Decoded");
        
        const tokenProperties: TokenProperties = decoded;
        const validated: boolean = await validateUser(req, res, tokenProperties);

        return validated ? next() : sendAuthError(res);

    } catch (err: any) {

        logger.warn("Error to validate token");
        logger.warn(err.message, err.name);

        return sendAuthTokenError(res);
    }
};