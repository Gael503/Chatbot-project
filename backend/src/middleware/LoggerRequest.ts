import { NextFunction, Request, Response } from "express";
import logger from "~/lib/logger";

export default function LoggerIncommingRequest(req: Request, res: Response, next: NextFunction){
    logger.info("Incomming request")
    logger.info({
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        body: req.body,
        params: req.params,
        query: req.query
    });
    next();
}