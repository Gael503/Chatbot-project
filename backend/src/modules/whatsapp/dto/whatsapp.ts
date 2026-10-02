import { BaseResponse } from "~/shared";
import { BotConnectionState } from "~/bot/status";
export class ConectionData{
    state: BotConnectionState = "inactive"
    connected: boolean = false
    host: Record<string, any> | null = null
    updatedAt: Date = new Date()
}
export class botStatusResponse extends BaseResponse<ConectionData>{
    constructor(){
        super();
        this.data = new ConectionData();
    }
}