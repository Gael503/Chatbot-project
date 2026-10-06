import { Loader } from "@/components/ui/loader"
import { QrInstrucctionsProps } from "../interfaces"
import { SquareX } from "lucide-react"
export default function QrInstrucctions(props: QrInstrucctionsProps){
    return(
        <div className="p-4 xl:w-2/4 sm:w-full">
            <h2 className="font-bold">
                Escanea el QR con el número que deseas conectar el bot
            </h2>
            <div className="flex w-full h-full flex-wrap">
                <div className="w-80 mr-2">
                    {!props.loading ? ( props.status === "connected" ? <SquareX className="m-auto" width={150} height={150}/> : <img src={props.image} alt="Qr wha" width={250} /> ) : <Loader /> }
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