import PostgreSQLConn from "~/database/posgresql";
import { getCurrentPrompt, getPrompts, createNewPrompt, updatePrompt } from "./utils/queries";
import logger from "~/lib/logger";
const pg = PostgreSQLConn.getInstance();

export const getPrompt = async (payload: any): Promise<any> => {
    const values: any[] = []
    try {
        let query = "";
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        return res.rows;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getPrompt.name}`)
    }
}

export const getAllPrompts = async (payload: any): Promise<any> => {
    const { pagination } = payload;
    const values: any[] = []
    try {
        let query = "";
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        return res.rows;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getPrompt.name}`)
    }
}

export const updateVersion = async (payload: any): Promise<any> => {
    const { pagination } = payload;
    const values: any[] = []
    try {
        let query = "";
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        return res.rows;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getPrompt.name}`)
    }
}

export const newVersion = async (payload: any): Promise<any> => {
    const values: any[] = []
    try {
        let query = "";
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        return res.rows;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getPrompt.name}`)
    }
}