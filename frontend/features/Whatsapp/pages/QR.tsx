"use client"
import { whatsAppService } from "@/services"
import { useEffect, useState } from "react"
import { Loader } from "@/components/ui/loader";

export default function QRBot(){
    const [image, setImage] = useState<any>(null);
    const getQr = async () => {
        const blob = await whatsAppService.getQr();
        if (!blob) {
            return;
        }

        const imageUrl = URL.createObjectURL(blob);

        setImage(imageUrl);
    }
    useEffect(() =>{
        getQr();
        // const interval = setInterval(() => {
        //     getQr();
        //     //refresca cada min
        // }, 1000 * 60);

        // return () => clearInterval(interval);
    },[])
    return(
        <div className="p-4">
            <h2 className="font-bold">
                Escanea el QR con el número que deseas conectar el bot
            </h2>
            <div className="flex h-80">
                <div className="w-80 mr-2">
                    {image ? <img src={image} alt="Qr wha" width={300} /> : <Loader /> }
                </div>
                <div className="grid m-auto ml-4">
                    <p>Entra a <strong>Whatsapp</strong> </p>
                    <p>En opciones da <strong>Dispositivos vinculados</strong></p>
                    <p>Vincular nuevo dispositivo </p>
                    <p>Aparecera dispositivo en chrome </p>
                </div>
            </div>
        </div>
    )
}