import { Pool } from "pg";
import config from "config";
import logger from "../lib/logger.js";

export default class PostgreSQLConn {
    private static _instance: PostgreSQLConn;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            host: config.get("pg.host"),
            port: config.get("pg.port"),
            user: config.get("pg.user"),
            password: config.get("pg.password"),
            database: config.get("pg.database"),
        });
    }

    public static getInstance(): PostgreSQLConn {
        return this._instance || (this._instance = new PostgreSQLConn());
    }

    public async connect(): Promise<void> {
        try {
            const client = await this.pool.connect();

            const result = await client.query("SELECT NOW()");
            logger.info(
                `PostgreSQL connected: ${result.rows[0].now}`
            );

            client.release();
        } catch (error) {
            logger.error(`PostgreSQL connection error: ${error}`);
            throw error;
        }
    }

    public getPool(): Pool {
        return this.pool;
    }
    
    //function to excute sql instructions
    public async executeQuery(sqlInstruction: string, values: any[] = []) {
        return this.pool.query(sqlInstruction, values);
    }
}