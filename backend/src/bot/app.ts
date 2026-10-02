import "dotenv/config"
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { Flows } from "./flows"
import PostgreSQLConn from "~/database/posgresql"
import BotStatus from "./status"
import logger from "~/lib/logger"
const PORT = process.env.PORT ?? 3008

export const main = async () => {
    const botStatus = BotStatus.getInstance();
    botStatus.setState("initializing");

    const postgres = PostgreSQLConn.getInstance();
    const flowClass = new Flows();
    const adapterFlow = createFlow([
        flowClass.mainFlow()
    ])
    // If you experience ERRO AUTH issues, check the latest WhatsApp version at:
    // https://wppconnect.io/whatsapp-versions/
    // Example: version "2.3000.1035824857-alpha" -> [2, 3000, 1035824857]
    const adapterProvider = createProvider(Provider,
		{ version: [2, 3000, 1044231902] }
	)
    //maneja los status de conexion del qr
    adapterProvider.on("require_action", () => {
        logger.info("WhatsApp bot: QR pendiente de escanear")
        botStatus.setState("qr_pending")
    })
    adapterProvider.on("ready", () => {
        logger.info("WhatsApp bot: conexion establecida")
        botStatus.setState("connected")
    })
    adapterProvider.on("host", (host: Record<string, any>) => {
        botStatus.setState("connected", host)
    })
    adapterProvider.on("auth_failure", (reasons: string[]) => {
        logger.error("WhatsApp bot: fallo de autenticacion " + JSON.stringify(reasons))
        botStatus.setState("auth_failure")
    })
    const adapterDB = new Database({
        host: postgres.getPool().options.host,
        port: postgres.getPool().options.port,
        user: postgres.getPool().options.user,
        password: postgres.getPool().options.password,
        database: postgres.getPool().options.database,
    });

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    httpServer(+PORT)
}