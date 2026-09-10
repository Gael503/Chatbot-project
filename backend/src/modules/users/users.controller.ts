import { Request, Response } from "express";
import { BaseResponse, HandleErrors } from "~/shared";
import { userService } from "./users.service";
import { userCreateResponse, userSearchRequest, userSearchResponse } from "./dto/user";

export const CreateUser = async (req: Request, res: Response): Promise <Response> =>{
    let response: userCreateResponse = new userCreateResponse();
    try {
        // response = await userService.create(req.body);
    } catch (error: any) {
        response = HandleErrors(CreateUser.name, error) as userCreateResponse;
    }
    return res.status(response.code).json(response);
}

export const SearchUsers = async (req: Request, res: Response): Promise <Response> =>{
    let response: userSearchResponse = new userSearchResponse();
    try {
        const payload: userSearchRequest = req.body;
        response = await userService.Search(payload);
    } catch (error: any) {
        response = HandleErrors(CreateUser.name, error) as BaseResponse;
    }
    return res.status(response.code).json(response);
}

export const DeactivateUser = async (req: Request, res: Response): Promise <Response> =>{
    let response: BaseResponse = new BaseResponse();
    try {
        const id: number = Number(req.params["id"])
        response = await userService.Deactivate(id);
    } catch (error: any) {
        response = HandleErrors(CreateUser.name, error) as BaseResponse;
    }
    return res.status(response.code).json(response);
}