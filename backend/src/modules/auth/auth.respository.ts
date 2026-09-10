import PostgreSQLConn from "~/database/posgresql";
import { UpdateLastLoginQuery } from "./utils/queries";
import { HandleErrors } from "~/shared";
import logger from "~/lib/logger";
const pg = PostgreSQLConn.getInstance();

export const UpdateLastLogin = async (email: string, id: number) => {
    try {
        const res = await pg.executeQuery({
            sqlInstruction:UpdateLastLoginQuery,
            values:[email, id]
        })
        return res.rows;
    } catch (error) {
        logger.error({error}, `Error to update ${UpdateLastLogin.name}: `)
        throw new Error(`Error in function ${UpdateLastLogin.name}`)
    }
}