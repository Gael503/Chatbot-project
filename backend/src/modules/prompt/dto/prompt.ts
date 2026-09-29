import { BaseResponse, Pagination } from "~/shared";
export class PromptEntity{
    id: number;
    content: string;
    version_num: number;
    created_at: Date;
    created_by: number;
    is_active: boolean;
}

export class promptData{
    id: number = 0;
    content: string = "";
    created_by: string = "";
    version_num: string = "";
    created_at: Date = new Date();
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
    version_num: number;
    pagination: Pagination;
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

export class CreatePromptRequest {
    content: string = "";
    created_by: number = 0;
}