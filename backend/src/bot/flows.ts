import { addKeyword, utils } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import IAservices from './services'
import { ChatMessage } from 'types';
import { promptService } from '~/modules/prompt/prompt.service';
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
            //Actualizacion agrego un try porque lo modelos gratuitos cambiaron y se rompieron.
            { capture: true },
            async (ctx, { fallBack }) => {
                try {
                    const prompt = await promptService.getCurrentContent();
                    const stream = await this.askIA([
                        {
                            role: 'system',
                            content: prompt
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
                    console.log("Respuesta de la IA?", answer);
                    return await fallBack(answer);
                } catch (error) {
                    //regresamos un prompt de error y generamos un log de error para que quien este acargo de supervisar revise que paso.
                    console.error("Error al generar respuesta: ", error);
                    return await fallBack("Lo sentimos nuestro servicio, se encuentra disponible en estos momento, por favor intente más tarde.")
                }
            }
        )
    }
}