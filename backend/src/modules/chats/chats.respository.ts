import PostgreSQLConn from "~/database/posgresql";
import { getContactsQuery, getHistoryQuery, getContactById } from "./utils/queries";
import logger from "~/lib/logger";
import { ContactsRequest, ContactEntity, HistoryRequest, HistoryEntity } from "./dto/chat";
const pg = PostgreSQLConn.getInstance();

export const getContacts = async (payload: ContactsRequest): Promise<{
    contacts: ContactEntity[],
    total: number
}> => {
    const { pagination } = payload;
    const values: any[] = []
    try {
        let query = getContactsQuery;

        const { size, offset } = pagination;
        values.push(size);
        query += ` LIMIT $${values.length}`;

        values.push(offset);
        query += ` OFFSET $${values.length}`;

        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values
        })
        const contacts = res.rows.length ? res.rows as ContactEntity[] : [];
        const total = res.rows.length > 0 ? res.rows[0].total : 0;
        return {
            contacts: contacts,
            total: total
        }
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getContacts.name}`)
    }
}

export const getHistory = async (payload: HistoryRequest): Promise<{
    history: HistoryEntity[],
    total: number
}> => {
    const { pagination } = payload;
    const values: any[] = []
    try {
        let query = getHistoryQuery;

        values.push(payload.idContact)
        query += ` and h.contact_id = $${values.length}`
        query += ` order by h.created_at desc`
        
        const { size, offset } = pagination;
        values.push(size);
        query += ` LIMIT $${values.length}`;

        values.push(offset);
        query += ` OFFSET $${values.length}`;
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: values,
        })
        const history = res.rows.length ? res.rows as HistoryEntity[] : [];
        const total = res.rows.length > 0 ? res.rows[0].total : 0;
        return { history, total }
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getHistory.name}`)
    }
}

export const getContactInfo = async (id_contact: number): Promise<ContactEntity | null> => {
    logger.info("Aqui")
    try {
        const res = await pg.executeQuery({
            sqlInstruction: getContactById,
            values: [id_contact],
            printResults: true
        })
        return res.rows[0] ?? null
    } catch (error) {
        logger.error({error}, "Error: ")
        throw new Error(`Error in function ${getContactInfo.name}`)
    }
}