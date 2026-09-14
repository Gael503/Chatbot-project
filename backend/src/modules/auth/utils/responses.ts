import { Http_codes } from "~/utils/Constants";
import { Response } from "express"

export const sendAuthError = (res: Response) =>
    res.status(Http_codes.unauthorized).json({
        success: false,
        code: Http_codes.unauthorized,
        message: "Unauthorized!",
    });

export const sendAuthTokenError = (res: Response) =>
    res.status(Http_codes.forbidden).json({
        success: false,
        code:  Http_codes.forbidden,
        message: "Invalid token"
    });