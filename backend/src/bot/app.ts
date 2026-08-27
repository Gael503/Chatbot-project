import "dotenv/config"
import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { Flows } from "./flows"
import PostgreSQLConn from "~/database/posgresql"
const PORT = process.env.PORT ?? 3008

export const main = async () => {
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