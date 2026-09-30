import PostgreSQLConn from "~/database/posgresql";
import { getCurrentPrompt, getPrompts, createNewPrompt, deactivatePrompts, activatePromptQuerie } from "./utils/queries";
import { CreatePromptRequest, promptData, PromptsListRequest } from "./dto/prompt";
import logger from "~/lib/logger";
const pg = PostgreSQLConn.getInstance();

export const getPrompt = async (): Promise<promptData> => {
    const values: any[] = []
    try {
        const res = await pg.executeQuery({
            sqlInstruction: getCurrentPrompt,
            values: values
        })
        return res.rows[0] as promptData;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getPrompt.name}`)
    }
}

export const getAllPrompts = async (payload: PromptsListRequest): Promise<{
    prompts: promptData[],
    total: number
}> => {
    const { pagination } = payload;
    const values: any[] = []
    try {
        let query = getPrompts;
        if(payload.version_num > 0){
            values.push(payload.version_num)
            query += ` and p.version_num = $${values.length}`
        }
        query += ` order by p.created_at desc`
        
        const { size, offset } = pagination;
        values.push(size);
        query += ` LIMIT $${values.length}`;

        values.push(offset);
        query += ` OFFSET $${values.length}`;

        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        const prompts = res.rows.length ? res.rows as promptData[] : [];
        const total = res.rows.length > 0 ? res.rows[0].total : 0;
        return {
            prompts: prompts,
            total: total
        };
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getAllPrompts.name}`)
    }
}

export const newVersion = async (payload: CreatePromptRequest): Promise<promptData> => {
    const { content, created_by } = payload;
    logger.info("Payload: ")
    logger.info(payload)
    try {
        const res = await pg.executeQuery({
            sqlInstruction: createNewPrompt,
            values: [content, created_by]
        })
        return res.rows[0] as promptData;
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${newVersion.name}`)
    }
}

export const activatePrompt = async (promptId: number): Promise<number> => {
    try {
        const resp = await pg.executeTransaction(
            async (client) => {
                await client.query(deactivatePrompts);
                const result = await client.query(activatePromptQuerie, [promptId]);
                return result;
            }
        );
        return resp.rows[0].id ?? 0

    } catch (error) {
        logger.error({ error }, "Error activating prompt");
        throw new Error(`Error in function ${activatePrompt.name}`);
    }
};