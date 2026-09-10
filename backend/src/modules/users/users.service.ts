import { ResponseProps, BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { userCreateRequest, userCreateResponse, userInfoResponse, userSearchRequest } from "./dto/user";
import { createUser, UserInfoByEmail, AllUsers } from "./users.respository";
import { hashString } from "~/lib/argon2";
import { Http_codes } from "~/utils/Constants";
import logger from "~/lib/logger";
class UserService{

    async create(payload: userCreateRequest): Promise<userCreateResponse>{
        WriteInitService(this.create.name)
        let createUserResponse = new userCreateResponse();
        try {
            const userInfo = await userService.GetUserInfo(payload.email)
            if(userInfo.success){
                createUserResponse.setErrorResponse({code: Http_codes.bad_request, message: "El usuario ya esta registrado"})
                return createUserResponse;
            }

            //esto es provisional no deberia vivir el encriptado aquí
            const newPass = await hashString(payload.password)
            payload.password = newPass;
            const resp = await createUser(payload);
            if(!resp){
                createUserResponse.setErrorResponse({message: "Ocurrio un error al crear el usuario intente más tarde"})
                return createUserResponse;
            }
            logger.info({resp}, "Usuario creado id:")
            createUserResponse.setSuccessResponse({
                message: "Usuario creado con exito!"
            });
            return createUserResponse
        } catch (error: any) {
            createUserResponse = HandleErrors(this.create.name, error) as userCreateResponse
            return createUserResponse;
        }finally{
            WriteEndService(this.create.name, createUserResponse)
        }
    }

    async Search(payload: userSearchRequest): Promise<BaseResponse> {
        WriteInitService(this.Search.name)
        let searchInfo = new BaseResponse();
        try {
            const resp = await AllUsers(payload)
            logger.info({resp}, "Response ")
            searchInfo.setSuccessResponse({});
        } catch (error: any) {
            searchInfo = HandleErrors(this.Search.name, error) as BaseResponse
        }
        WriteEndService(this.Search.name, searchInfo)
        return searchInfo;
    }
    // debe ser ruta protegida...
    async GetUserInfo(email: string): Promise<userInfoResponse> {
        WriteInitService(this.GetUserInfo.name)
        let userInfo = new userInfoResponse();
        try {
            const resp = await UserInfoByEmail(email)
            logger.info({resp}, "Response ")
            if(!resp){
                userInfo.setErrorResponse({message: "Usuario no existente o activo", code: Http_codes.not_found})
                return userInfo;
            }
            userInfo.setSuccessResponse({message: "Usuario encontrado", data: resp});
        } catch (error: any) {
            userInfo = HandleErrors(this.GetUserInfo.name, error) as userInfoResponse
        }
        WriteEndService(this.GetUserInfo.name, userInfo)
        return userInfo;
    }

}

export const userService = new UserService();