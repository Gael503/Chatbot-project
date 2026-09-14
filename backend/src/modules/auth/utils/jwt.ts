import config from "config"
import jwt from 'jsonwebtoken';
import logger from "~/lib/logger";
import { UserInfo } from "~/modules/users/dto/user";

const secret: string = config.get("jwt.secret")

export const generateToken = async (user: UserInfo) => {

    if(!secret)
        throw new Error("JWT secret not configured!")
    logger.info("Generando token de acceso")
    return jwt.sign(
        {
            userId: 99,
            email: user.email,
            name: user.name,
        },
        secret,
        {
            expiresIn: config.get("jwt.expires_in") || "1h"
        }
    )
}

