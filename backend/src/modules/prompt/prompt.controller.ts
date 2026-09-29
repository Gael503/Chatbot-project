import { Request, Response } from "express";
import { Http_codes } from "~/utils/Constants";
import { promptService } from "./prompt.service";
import { BaseResponse, HandleErrors } from "~/shared";
import { PromptResponse, PromptsListResponse } from "./dto/prompt";

export const CurrentPrompt = async (req: Request, res: Response): Promise <Response> =>{
    let response: PromptResponse = new PromptResponse();
    try {
        response = await promptService.current();
    } catch (error: any) {
        response = HandleErrors(CurrentPrompt.name, error) as PromptResponse;
    }
    return res.status(response.code).send(response)
}

export const PromptsList = async (req: Request, res: Response): Promise <Response> =>{
    let response: PromptsListResponse = new PromptsListResponse();
    try {
        response = await promptService.search(req.body);
    } catch (error: any) {
        response = HandleErrors(CurrentPrompt.name, error) as PromptsListResponse;
    }
    return res.status(response.code).send(response)
}

export const CreatePrompt = async (req: Request, res: Response): Promise <Response> =>{
    let response: PromptResponse = new PromptResponse();
    try {
        response = await promptService.create(req.body.content, req.internal_process);
    } catch (error: any) {
        response = HandleErrors(CurrentPrompt.name, error) as PromptResponse;
    }
    return res.status(response.code).send(response)
}

export const ActivatePrompt = async (req: Request, res: Response): Promise <Response> =>{
    let response: BaseResponse = new BaseResponse<{promptId: string}>();
    try {
        const promptId: number = Number(req.params["id"]);
        response = await promptService.activate(promptId);
    } catch (error: any) {
        response = HandleErrors(CurrentPrompt.name, error) as BaseResponse;
    }
    return res.status(response.code).send(response)
}