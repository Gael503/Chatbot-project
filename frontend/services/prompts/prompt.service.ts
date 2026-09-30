import { api, apiForm } from "@/lib/api";
import { PromptResponse, PromptsListRequest, PromptsListResponse } from "./classes";
import { BaseResponse } from "@/shared";

class PromptService{
    async search(payload: PromptsListRequest): Promise<PromptsListResponse>{
        let PromptList = new PromptsListResponse();
        try {
            const resp = await api.post<PromptsListResponse>("/prompt/search", payload)
            PromptList = resp.data;
            return PromptList;
        } catch (error) {
            return PromptList;
        }
    }

    async getCurrent(): Promise<PromptResponse>{
        let currentPrompt = new PromptResponse();
        try {
            const resp = await api.get<PromptResponse>("/prompt")
            currentPrompt = resp.data;
            return currentPrompt;
        } catch (error) {
            return currentPrompt;
        }
    }

    async create(filePrompt: File): Promise<PromptResponse>{
        const form = new FormData();
        form.append("file", filePrompt)
        let createPromptResponse = new PromptResponse();
        try {
            const resp = await apiForm.post<PromptResponse>("/prompt", form)
            createPromptResponse = resp.data;
            return createPromptResponse;
        } catch (error) {
            return createPromptResponse;
        }
    }

    async activate(promptId: number): Promise<BaseResponse<{promptId: number}>>{
        let activatePrompt = new BaseResponse<{promptId: number}>();
        try {
            const resp = await api.put<BaseResponse<{promptId: number}>>(`/prompt/activate/${promptId}`)
            activatePrompt = resp.data;
            return activatePrompt;
        } catch (error) {
            return activatePrompt;
        }
    }
}

export const promptService = new PromptService();