import { MutatingDots } from 'react-loader-spinner'
export default function LoaderPage(){
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