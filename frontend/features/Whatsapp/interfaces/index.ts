import { ConectionData, BotConnectionState } from "@/services/whatsapp/classes";
import { JSX } from "react/jsx-runtime";

export interface QrInstrucctionsProps{
    loading: boolean,
    image: any,
    status: BotConnectionState
}

export interface StatusBotProps {
    loading: boolean;
    error: boolean;
    status?: statusInfo;
    connectionData: ConectionData;
}

export interface statusInfo {
    text: string;
    icon: JSX.Element;
    border: string;
}