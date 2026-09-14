import PostgreSQLConn from "~/database/posgresql";
import { UpdateLastLoginQuery, ValidateAccess } from "./utils/queries";
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

export const ValidateUserAccess = async (email: string, id: number) => {
    logger.info("ValidateUserAccess to user")
    try {
        const res = await pg.executeQuery({
            sqlInstruction:ValidateAccess,
            values:[email, id],
        })
        logger.info({response: res.rows[0]}, "ValidateUserAccess response :")
        return res.rows[0] ?? null;
    } catch (error) {
        logger.error({error}, `Error in ${ValidateUserAccess.name}: `)
        throw new Error(`Error in function ${ValidateUserAccess.name}`)
    }
}