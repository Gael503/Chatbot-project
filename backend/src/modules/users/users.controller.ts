import { Request, Response } from "express";
import { BaseResponse, HandleErrors } from "~/shared";
import { userService } from "./users.service";
import { userCreateResponse } from "./dto/user";

export const CreateUser = async (req: Request, res: Response): Promise <Response> =>{
    let response: userCreateResponse = new userCreateResponse();
    try {
        response = await userService.create(req.body);
    } catch (error: any) {
        response = HandleErrors(CreateUser.name, error) as userCreateResponse;
    }
    return res.status(response.code).json(response);
}

export const SearchUsers = async (req: Request, res: Response): Promise <Response> =>{
    let response: BaseResponse = new BaseResponse();
    try {
        response = await userService.Search(req.body);
    } catch (error: any) {
        response = HandleErrors(CreateUser.name, error) as BaseResponse;
    }
    return res.status(response.code).json(response);
}