import { WriteInitService, WriteEndService, HandleErrors } from "~/shared";
import { LoginRequest, LoginResponse } from "./dto/login";
import { UpdateLastLogin } from "./auth.respository";
import { userService } from "../users/users.service";
import { verifyPassword } from "~/lib/argon2";
import logger from "~/lib/logger";
import { Http_codes } from "~/utils/Constants";
import { generateToken } from "./utils/jwt";

class LoginService{

    async verify(request: LoginRequest): Promise<LoginResponse>{
        WriteInitService(this.verify.name)
        let loginData = new LoginResponse();
        try {
            const resp = await userService.GetUserInfo(request.email)
            if(!resp.success){
                loginData.setErrorResponse({code: Http_codes.forbidden, message: "Usuario no encontrado"})
                return loginData;
            }
            //verificar
            const { data } = resp;

            const isValid = await verifyPassword(data.password, request.password);
            if(!isValid){
                logger.info("Contraseña no valida!")
                loginData.setErrorResponse({code: Http_codes.unauthorized, message: "Unauthorized"});
                return loginData;
            }
            const token:string = await generateToken(data);
            loginData.setSuccessResponse({message: "Ok", data: {
                userId: data.id,
                name: data.name,
                email: data.email,
                token: token
            }});
            await UpdateLastLogin(request.email, data.id)
            return loginData;
        } catch (error: any) {
            loginData = HandleErrors(this.verify.name, error) as LoginResponse
            return loginData
        }finally{
            WriteEndService(this.verify.name, loginData)
        }
    }

}

export const loginService = new LoginService();