export type BotConnectionState =
    | "inactive"
    | "initializing"
    | "qr_pending"
    | "connected"
    | "auth_failure";
//maneja el status del bot
export default class BotStatus {
    private static _instance: BotStatus;
    private state: BotConnectionState = "inactive";
    private host: Record<string, any> | null = null;
    private updatedAt: Date = new Date();

    private constructor() {}

    public static getInstance(): BotStatus {
        return this._instance || (this._instance = new BotStatus());
    }

    public setState(state: BotConnectionState, host?: Record<string, any>): void {
        this.state = state;
        this.updatedAt = new Date();
        if (host) this.host = host;
        if (state === "qr_pending" || state === "auth_failure" || state === "initializing") {
            this.host = null;
        }
    }

    public isConnected(): boolean {
        return this.state === "connected";
    }

    public getStatus() {
        return {
            state: this.state,
            connected: this.isConnected(),
            host: this.host,
            updatedAt: this.updatedAt,
        };
    }
}
