import { Request, Response } from "express";
import { BaseResponse, HandleErrors } from "~/shared";
import { chatService } from "./chats.service";
import { HistoryRequest, HistoryResponse, ContactsRequest, ContactResponse } from "./dto/chat";

export const Contacts = async (req: Request, res: Response): Promise <Response> =>{
    let response: ContactResponse = new ContactResponse();
    try {
        const payload: ContactsRequest = req.body;
        response = await chatService.Contacts(payload)
    } catch (error: any) {
        response = HandleErrors(Contacts.name, error) as ContactResponse;
    }
    return res.status(response.code).json(response);
}

export const History = async (req: Request, res: Response): Promise <Response> =>{
    let response: HistoryResponse = new HistoryResponse();
    try {
        const payload: HistoryRequest = req.body;
        response = await chatService.History(payload)
    } catch (error: any) {
        response = HandleErrors(History.name, error) as HistoryResponse;
    }
    return res.status(response.code).json(response);
}
