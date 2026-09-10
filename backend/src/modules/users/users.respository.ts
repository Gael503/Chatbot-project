import PostgreSQLConn from "~/database/posgresql";
import { CreateUserQuery, getUserInfoByEmail, searchUsers } from "./utils/queries";
import { userCreateRequest, UserInfo, userSearchRequest } from "./dto/user";
import logger from "~/lib/logger";
const pg = PostgreSQLConn.getInstance();

export const createUser = async (payload: userCreateRequest): Promise<string | null> => {
    logger.info({payload}, "Payload: ");
    const { name ,email, password } = payload;
    try {
        const res = await pg.executeQuery({
            sqlInstruction: CreateUserQuery,
            values: [name, email, password] 
        })
        return res.rows.length ? res.rows[0].id as string : null;
    } catch (error) {
        logger.error({error},"Error al crear usuario!")
        throw new Error(`Error in function ${createUser.name}`)
    }
}

export const UserInfoByEmail = async (email: string): Promise<UserInfo | null> => {
    try {
        const res = await pg.executeQuery({
            sqlInstruction: getUserInfoByEmail,
            values: [email]
        })
        return res.rows.length ? res.rows[0] as UserInfo : null;
    } catch (error) {
        throw new Error(`Error in function ${UserInfoByEmail.name}`)
    }
}

export const AllUsers = async (payload: userSearchRequest) => {
    const { id, email, name, pagination } = payload;
    try {
        let query = searchUsers;
        const values: any[]= [];

        if(id > 0){
            values.push(id)
            query += ` and id = $${values.length}`
        }

        if(email != ""){
            values.push(email)
            query += ` and email = $${values.length}`
        }
        
        if(name != ""){
            values.push(name);
            query += ` and name ilike $${values.length}`
        }
        const { size, offset } = pagination;
        values.push(size);
        query += ` LIMIT $${values.length}`;

        values.push(offset);
        query += ` OFFSET $${values.length}`;
        const res = await pg.executeQuery({
            sqlInstruction: query,
            values: []
        })
        return res.rows ?? [];
    } catch (error) {
        throw new Error(`Error in function ${AllUsers.name}`)
    }
}