import express from "express";
import config from "config";
import logger from "./lib/logger";
import PostgreSQLConn from "./database/posgresql";
import { main } from "./bot/app";
import LoggerIncommingRequest from "./middleware/LoggerRequest";
import routes from "./modules/router"
import { ValidateToken } from "./middleware/ValidateToken";
import cors from "cors"

const app = express();
const port = config.get("api.port")
const connpg = PostgreSQLConn.getInstance();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(ValidateToken)
app.use(LoggerIncommingRequest)
app.use("/api", routes)

app.listen(port, () =>{
    logger.info("Server running on " +  port)
    connpg.connect();
    // main();
})