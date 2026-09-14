import { ResponseProps, BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { getPrompt, getAllPrompts, newVersion, updateVersion } from "./prompt.respository";
import { Http_codes } from "~/utils/Constants";
import logger from "~/lib/logger";
class PromptService{

    async current(payload: any): Promise<BaseResponse>{
        WriteInitService("PromptService - " + this.current.name)
        let response = new BaseResponse();
        try {
            response.setSuccessResponse({message: "", data: null})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.current.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.current.name, response)
        }
    }

    async search(payload: any): Promise<BaseResponse>{
        WriteInitService("PromptService - " + this.current.name)
        let response = new BaseResponse();
        try {
            const pagination = Object.assign(new Pagination(), payload.pagination);
            payload.pagination = pagination;
            response.setSuccessResponse({message: "", data: null})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.current.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.current.name, response)
        }
    }

    async update(payload: any): Promise<BaseResponse>{
        WriteInitService("PromptService - " + this.update.name)
        let response = new BaseResponse();
        try {
            response.setSuccessResponse({message: "", data: null})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.update.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.update.name, response)
        }
    }

    async create(payload: any): Promise<BaseResponse>{
        WriteInitService("PromptService - " + this.create.name)
        let response = new BaseResponse();
        try {
            response.setSuccessResponse({message: "", data: null})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.create.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.create.name, response)
        }
    }
}

export const promptService = new PromptService();