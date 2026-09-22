import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

//default headers
const headers: Record<string, any> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const setAuth = (token: string) => {
    headers['Authorization'] = `Bearer ${token}`;
}
//debug
export const getHeaders = () => {
    return headers;
}
const config = {
    headers,
    timeout: 30000,
    //dejar pasar los codigos de error que mande el be
    validateStatus: (status: number) => status >= 200 && status < 300 || status >= 400 && status <= 404
}

//return
export const api = axios.create({
    baseURL: baseURL,
    ...config
})