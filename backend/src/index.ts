import express from "express";
import config from "config";
import logger from "./lib/logger";
import PostgreSQLConn from "./database/posgresql";
import { main } from "./bot/app";
import routes from "./modules/router"
const app = express();
const port = config.get("api.port")
const connpg = PostgreSQLConn.getInstance();
app.use("/api", routes)
app.listen(port, () =>{
    logger.info("Server running on " +  port)
    connpg.connect();
    main();
})