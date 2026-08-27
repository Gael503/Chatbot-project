import config from 'config';
import OpenAI from 'openai';
import type { AIServices, ChatMessage } from 'types';

const openai = new OpenAI({
    apiKey: config.get("ia_services.open_ia.api_key") || "",
});

export const openAIService: AIServices = {
    name: 'openai',

    async chat(messages: ChatMessage[]) {
        const stream = await openai.chat.completions.create({
            model: config.get("ia_services.open_ia.api_key") || "",
            messages,
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            stream: true,
        });

        return (async function* () {
            for await (const chunk of stream) {
                yield chunk.choices[0]?.delta?.content ?? '';
            }
        })();
    }
};