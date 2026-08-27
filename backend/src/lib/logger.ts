import config from "config";
import pino from "pino";

const logger = pino({
    level: config.get("api.logger_level") || "info",
    
    transport: process.env.NODE_ENV !== "production" ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
        },}
        : undefined,
});

export default logger;