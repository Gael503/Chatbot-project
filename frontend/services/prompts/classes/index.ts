import { BaseResponse, Pagination } from "@/shared";

export class promptData{
    id: number = 0;
    content: string = "";
    created_by: string = "";
    version_num: string = "";
    created_at: string = "";
    is_active: boolean = false;
}

export class PromptResponse extends BaseResponse<{
    prompt: promptData
}>{
    constructor(){
        super();
        this.data = {
            prompt: new promptData()
        }
    }
}

export class PromptsListRequest{
    version_num?: number;
    pagination: Pagination = new Pagination();
}

export class PromptsListResponse extends BaseResponse<{
    pagination: Pagination,
    prompts: promptData[]
}>{
    constructor(){
        super();
        this.data = {
            pagination: new Pagination(),
            prompts: []
        }
    }
}