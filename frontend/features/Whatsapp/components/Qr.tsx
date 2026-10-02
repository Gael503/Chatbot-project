import { Loader } from "@/components/ui/loader"
import { QrInstrucctionsProps } from "../interfaces"
export default function QrInstrucctions(props: QrInstrucctionsProps){
    return(
        <div className="p-4">
            <h2 className="font-bold">
                Escanea el QR con el número que deseas conectar el bot
            </h2>
            <div className="flex h-80">
                <div className="w-80 mr-2">
                    {!props.loading ? <img src={props.image} alt="Qr wha" width={300} /> : <Loader /> }
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