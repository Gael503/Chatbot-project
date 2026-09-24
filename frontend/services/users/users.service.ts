import { api } from "@/lib/api";
import { userSearchRequest, userSearchResponse } from "./classes/user";

class UserService{
    async search(payload: userSearchRequest): Promise<userSearchResponse>{
        let response = new userSearchResponse();
        try {
            const resp = await api.post("/users/search", payload)
            console.log(resp);
            response = resp.data;
            return response;
        } catch (error) {
            return response;
        }
    }
}

export const userService = new UserService();