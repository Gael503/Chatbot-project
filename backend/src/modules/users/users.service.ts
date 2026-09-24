import { ResponseProps, BaseResponse, WriteInitService, WriteEndService, HandleErrors, Pagination } from "~/shared";
import { userCreateRequest, userCreateResponse, userInfoResponse, userSearchRequest, userSearchResponse } from "./dto/user";
import { createUser, UserInfoByEmail, AllUsers, UserInfoById, DeactivateUser } from "./users.respository";
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

    async Search(payload: userSearchRequest): Promise<userSearchResponse> {
        WriteInitService(this.Search.name)
        let searchInfo = new userSearchResponse();
        try {
            const pagination = Object.assign(new Pagination(), payload.pagination);
            payload.pagination = pagination;
            const { users, total } = await AllUsers(payload)
            if(!users.length){
                searchInfo.setErrorResponse({message: "No se encontraron usuarios relacionados"})
                return searchInfo;
            }
            pagination.total = total;
            pagination.calculate();
            searchInfo.setSuccessResponse({message: "Usuarios listados", data: {
                users: users,
                pagination: pagination
            }});
            return searchInfo;
        } catch (error: any) {
            searchInfo = HandleErrors(this.Search.name, error) as userSearchResponse
            return searchInfo
        } finally{
            WriteEndService(this.Search.name, searchInfo.message)
        }
    }
    // debe ser ruta protegida...
    async GetUserInfo(email: string): Promise<userInfoResponse> {
        WriteInitService(this.GetUserInfo.name)
        let userInfo = new userInfoResponse();
        try {
            const resp = await UserInfoByEmail(email)
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

    async GetUserInfoById(id: number): Promise<userInfoResponse> {
        WriteInitService(this.GetUserInfoById.name)
        let userInfo = new userInfoResponse();
        try {
            const resp = await UserInfoById(id)
            if(!resp){
                userInfo.setErrorResponse({message: "Usuario no existente o activo", code: Http_codes.not_found})
                return userInfo;
            }
            userInfo.setSuccessResponse({message: "Usuario encontrado", data: resp});
        } catch (error: any) {
            userInfo = HandleErrors(this.GetUserInfoById.name, error) as userInfoResponse
        }
        WriteEndService(this.GetUserInfoById.name, userInfo)
        return userInfo;
    }

    async Deactivate(id: number): Promise<BaseResponse> {
        WriteInitService(this.Deactivate.name)
        let desctivateResp = new BaseResponse();
        try {
            const resp = await this.GetUserInfoById(id)
            if(!resp.success){
                desctivateResp.setErrorResponse({message: "Usuario no encontrado"})
                return desctivateResp;
            }
            const { data } = resp;
            if(!data.is_active){
                desctivateResp.setErrorResponse({message: "Usuario actualmente desactivado"})
                return desctivateResp;
            }
            const isDeactivate: boolean = await DeactivateUser(id);
            logger.info(`Usuario desactivado?: ${isDeactivate}`)
            const message = isDeactivate ? "Usuario desactivado correctamente" : "Error al desactivar usuario";
            if(!isDeactivate){
                desctivateResp.setErrorResponse({message})
                return desctivateResp;
            }
            desctivateResp.setSuccessResponse({message});
            return desctivateResp;
        } catch (error: any) {
            desctivateResp = HandleErrors(this.Deactivate.name, error) as BaseResponse
            return desctivateResp;
        } finally{
            WriteEndService(this.Deactivate.name, desctivateResp)
        }
    }

}

export const userService = new UserService();