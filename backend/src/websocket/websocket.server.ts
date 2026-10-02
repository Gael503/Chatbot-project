import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export const initWebSocket = (server: any) => {
    wss = new WebSocketServer({
        server,
        path: "/ws",
    });

    wss.on("connection", (socket) => {
        console.log("WebSocket conectado");

        socket.on("close", () => {
            console.log("WebSocket desconectado");
        });
    });
};

export const broadcast = (message: unknown) => {
    if (!wss) return;

    const payload = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
};