import { cache } from "./cache";
import { internal_process } from "../interfaces";
import { ValidateUserAccess } from "../auth/auth.respository";
import logger from "~/lib/logger";

export class CacheService {
    async get(email: string, id: number): Promise<internal_process | null> {
        const key = `auth:${email}`;

        const cached = cache.get<any>(key);

        return cached ? cached : this.set(email, id);
    }

    async set(email: string, id: number): Promise<internal_process | null> {
        logger.warn("Seteando cache")
        const key = `auth:${email}`;

        //request to db
        const data: internal_process = await ValidateUserAccess(email, id);
        //para no colocar is_active...
        cache.set(key, data ? {
            email: data.email,
            user_id: data.user_id
        } : null);

        return data;
    }

    delete(email: string): void {
        cache.del(`auth:${email}`);
    }
}

export const cacheService = new CacheService();