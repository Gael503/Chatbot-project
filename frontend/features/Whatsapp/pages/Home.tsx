"use client"
import { whatsAppService } from "@/services"
import { useEffect, useState } from "react"
import { statusInfo } from "../interfaces";
import { useTranslations } from "next-intl";
import { ConectionData } from "@/services/whatsapp/classes";
import getStatusData from "../utils/statusMap";
import StatusBot from "../components/statusBot";
import QrInstrucctions from "../components/Qr";
import { useWebSocket } from "@/shared/hooks/useWebsockets";

export default function QRBot(){
    const t = useTranslations();
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingFirst, setLoadingFirst] = useState<boolean>(true);
    const [statusLoading, setStatusLoading] = useState<boolean>(true);
    const [connectionData, setConnectionData] = useState<ConectionData>(new ConectionData())
    const [status, setStatus] = useState<statusInfo>();
    const [statusError, setStatusError] = useState<boolean>(false);
    const getQr = async () => {
        loadingFirst ?? setLoading(true)
        try {
            const blob = await whatsAppService.getQr();
            if (!blob) return;
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
        } catch (error) {

        } finally{
            if(loadingFirst){
                setLoading(false);
                setLoadingFirst(false);
            }
        }
    }
    const getStatus = async () => {
        setStatusLoading(true)
        try {
            const response = await whatsAppService.getStatus();
            if(!response.success || !response.data){
                setStatusError(true);
                return;
            }
            setConnectionData(response.data)
            const state = getStatusData(response.data.state, t)
            setStatus(state)
        } catch (error) {

        } finally {
            setStatusLoading(false)
        }
    }
    useEffect(() =>{
        getQr();
        const interval = setInterval(() => {
            getQr();
            //refresca cada min
        }, 1000 * 30);

        return () => clearInterval(interval);
    },[])
    useEffect(() =>{
        getStatus();
    },[])
    useWebSocket((message) => {

        if (message.type === "WHATSAPP_QR_UPDATED" || message.type === "WHATSAPP_CONNECTED") {
            // getQr();
            getStatus();
        }
    });
    return(
        <div className="flex flex-wrap">
            <QrInstrucctions image={image} loading={loading} status={connectionData.state}/>
            <StatusBot
                loading={statusLoading}
                error={statusError}
                status={status}
                connectionData={connectionData}
            />
        </div>
    )
}