import { groqService } from "./groq";
import { openAIService } from "./openIa";
import { AIServices } from "types";

export default class IAservices{
    currentServiceIndex: number = 0;
    services: AIServices[]

    constructor(){
        //lista de los modelos de IA para ir intercalando entre otros
        this.services = [
            //modelo gratuito
            groqService,
            // openAIService,
            
        ]
    }
    //intercambiar entre servicios
    NextService(){
        const service = this.services[this.currentServiceIndex];
        this.currentServiceIndex = (this.currentServiceIndex + 1) % this.services.length;
        return service;
    }
}