// modulo para cifrar
import argon2 from "argon2";

export const hashString = async (text: string) => {
    return await argon2.hash(text);
}
// contraseña hash, pass en claro
export const verifyPassword = async (passHash: string, password: string) => {
    return await argon2.verify(passHash, password)
}
