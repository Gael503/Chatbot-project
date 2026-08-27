import config from 'config';
import { Groq } from 'groq-sdk';
import type { AIServices, ChatMessage } from 'types';

const groq = new Groq({
  apiKey: config.get("ia_services.groq.api_key") || ""
});
export const groqService: AIServices = {
  name: 'groq',
  async chat(messages:ChatMessage[]) {
    const chatCompletion = await groq.chat.completions.create({
      messages,
      "model": config.get("ia_services.groq.model") || "",
      "temperature": 1,
      "max_completion_tokens": 2048,
      "top_p": 1,
      "stream": true,
      "stop": null
  });
  // regresa la respuesta del modelo poco a poco
  return (async function* (){
    for await (const chunk of chatCompletion)
      yield chunk.choices[0]?.delta?.content || '';
  })()
  }
}
