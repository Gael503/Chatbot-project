import { MutatingDots, ThreeDots } from 'react-loader-spinner'
//cargador que cubre toda la pagina
export function LoaderPage(){
    return(
        <div className='grid m-auto'>
            <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            secondaryColor="#4fa94d"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
            <p className='font-bold text-2xl -ml-2'>Cargando....</p>
        </div>
    )
}
//cargador generico v1
export function Loader(props : {className?: string, width?: number, height?: number}){
    return(
        <div className={`grid m-auto ${props.className}`}>
            <ThreeDots
            visible={true}
            height={props.height ? props.height : "80"}
            width={props.width ? props.width : "80"}
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            />
        </div>
    )
}