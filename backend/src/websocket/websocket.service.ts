import { broadcast } from "./websocket.server"

export type WebSocketEvent =
    | "CONTACT_CREATED"
    | "WHATSAPP_CONNECTED"
    | "WHATSAPP_DISCONNECTED"
    | "WHATSAPP_QR_UPDATED";

export const websocketService = {

    contactCreated(contactId: number) {
        broadcast({
            type: "CONTACT_CREATED",
            data: {
                id: contactId,
            },
        });
    },

    whatsappConnected() {
        broadcast({
            type: "WHATSAPP_CONNECTED",
        });
    },

    whatsappDisconnected() {
        broadcast({
            type: "WHATSAPP_DISCONNECTED",
        });
    },

};