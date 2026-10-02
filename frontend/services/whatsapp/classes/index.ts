import { BaseResponse } from "@/shared";

export type BotConnectionState =
    | "inactive"
    | "initializing"
    | "qr_pending"
    | "connected"
    | "auth_failure";


export class HostData{
    id: string = "";
    lid: string = "";
    phone: string = "";
}
export class ConectionData{
    state: BotConnectionState = "inactive"
    connected: boolean = false
    host: HostData | null = null
    updatedAt: string = "";
}
export class botStatusResponse extends BaseResponse<ConectionData>{
    constructor(){
        super();
        this.data = new ConectionData();
    }
}