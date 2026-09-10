import { Request, Response } from "express";
import { BaseResponse, HandleErrors } from "~/shared";
import { loginService } from "./auth.service";
import { LoginRequest } from "./dto/login";

export const Login = async (req: Request, res: Response): Promise <Response> =>{
    let response: BaseResponse = new BaseResponse();
    try {
        const payload: LoginRequest = req.body;
        response = await loginService.verify(payload);
    } catch (error: any) {
        response = HandleErrors(Login.name, error) as BaseResponse;
    }
    return res.status(response.code).json(response);
}