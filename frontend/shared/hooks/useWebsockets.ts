"use client";

import { useEffect, useRef } from "react";

export function useWebSocket(onMessage: (message: any) => void){
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    useEffect(() => {
        const socket = new WebSocket(
            `${process.env.NEXT_PUBLIC_WS_URL}/ws`
        );
        //debug
        // socket.onopen = () => {
        //     console.log("WebSocket conectado");
        // };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            onMessageRef.current(message);
        };
        //debug
        // socket.onclose = () => {
        //     console.log("WebSocket desconectado");
        // };

        return () => {
            socket.close();
        };
    }, []);
}