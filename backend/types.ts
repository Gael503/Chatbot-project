export type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
    role: ChatRole;
    content: string;
}

interface AIServices {
    name: string;
    chat: (messages: ChatMessage[]) => Promise<AsyncIterable<string>>;
}

export {
    ChatMessage,
    AIServices
}