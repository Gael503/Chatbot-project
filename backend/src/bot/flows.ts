import { addKeyword, utils } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import IAservices from './services'
import { ChatMessage } from 'types';
import { MyPrompt } from './prompt';
export class Flows {
    private iaService = new IAservices();

    private async askIA(messages: ChatMessage[]) {
        const service = this.iaService.NextService();
        return await service.chat(messages);
    }

    mainFlow() {
        return addKeyword<Provider, Database>([
            'hola',
            'hi',
            'hello',
            utils.setEvent("WELCOME")
        ])
        .addAnswer(
            '¡Hola! Soy tu asistente de pruebas estoy listo para lo que necesites!',
            // apartir de aqui los siguientes mensajes seran interpretados por la ia
            { capture: true },
            async (ctx, { fallBack }) => {

                const stream = await this.askIA([
                    {
                        role: 'system',
                        content: MyPrompt
                    },
                    {
                        role: 'user',
                        content: ctx.body
                    }
                ]);

                let answer = "";

                for await (const chunk of stream) {
                    answer += chunk;
                }

                return await fallBack(answer);
            }
        );
    }
}