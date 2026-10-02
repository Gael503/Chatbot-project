import { BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { CreatePromptRequest, PromptResponse, PromptsListRequest, PromptsListResponse } from "./dto/prompt";
import { getPrompt, getAllPrompts, newVersion, activatePrompt } from "./prompt.respository";
import { internal_process } from "../interfaces";
import { MissingPrompt } from "./utils/promptBase";
import { promptCache } from "../cache/cache";
const CURRENT_PROMPT_KEY = 'current_prompt';
class PromptService{

    async current(): Promise<PromptResponse>{
        WriteInitService("PromptService - " + this.current.name)
        let response = new BaseResponse();
        try {
            const CurrentPrompt = await getPrompt();
            if(!CurrentPrompt){
                response.setErrorResponse({
                    message: "Actualmente no hay un prompt activo"
                })
                return response;
            }
            response.setSuccessResponse({message: "Prompt recuperado ", data: {
                prompt: CurrentPrompt
            }})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.current.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.current.name, response)
        }
    }

    async search(payload: PromptsListRequest): Promise<PromptsListResponse>{
        WriteInitService("PromptService - " + this.current.name)
        let response = new PromptsListResponse();
        try {
            const pagination = Object.assign(new Pagination(), payload.pagination);
            payload.pagination = pagination;
            const { prompts, total } = await getAllPrompts(payload);
            if(!prompts.length){
                response.setErrorResponse({
                    message: "No hay prompts por listar",
                })
                return response;
            }
            pagination.total = total;
            pagination.calculate()
            response.setSuccessResponse({message: "Prompts recuperados", data: {
                prompts: prompts,
                pagination: pagination
            }})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.current.name, error) as PromptsListResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.current.name, response)
        }
    }

    async create(content: string, audit: internal_process): Promise<PromptResponse>{
        WriteInitService("PromptService - " + this.create.name)
        let response = new BaseResponse();
        try {
            const payload: CreatePromptRequest = {
                "content": content,
                "created_by": audit.user_id
            }
            const prompt = await newVersion(payload);
            if(!prompt){
                response.setErrorResponse({
                    message: "Error al crear nueva version del prompt"
                })
                return response;
            }
            response.setSuccessResponse({message: "Prompt creado con exito!", data: prompt})
            return response;
        } catch (error: any) {
            response = HandleErrors(this.create.name, error) as BaseResponse;
            return response;
        } finally{
            WriteEndService("PromptService - " + this.create.name, response)
        }
    }

    async activate(promptId: number): Promise<BaseResponse<{promptId: number}>> {
        WriteInitService("PromptService - " + this.activate.name);
        let response = new BaseResponse<{promptId: number}>();
        try {
            const activated: number = await activatePrompt(promptId);

            if (!activated) {
                response.setErrorResponse({
                    message: "El prompt solicitado no existe",
                    data: null
                });
                return response;
            }

            response.setSuccessResponse({
                message: "Prompt activado correctamente",
                data: { promptId: activated }
            });
            //se borra cache si existe en caso de activar el nuevo prompt
            promptCache.del(CURRENT_PROMPT_KEY);

            return response;

        } catch (error: any) {
            response = HandleErrors(this.activate.name, error) as BaseResponse;
            return response;
        } finally {
            WriteEndService("PromptService - " + this.activate.name, response);
        }
    }

    //funcion que regresa el promptActual usando cache
    async getCurrentContent(): Promise<string> {
        const cachedPrompt = promptCache.get<string>(CURRENT_PROMPT_KEY);

        if (cachedPrompt) return cachedPrompt;

        const response = await this.current();
        if (!response.success) return MissingPrompt;

        const content = response.data.prompt.content;
        promptCache.set(CURRENT_PROMPT_KEY, content);

        return content;
    }
}

export const promptService = new PromptService();