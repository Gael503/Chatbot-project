import * as z from "zod";

export const UserCreateSchema = z.object({
    name: z.string({message: "Name es requerido"}).min(2).max(100),
    email: z.email().max(255),
    password: z.string({message: "Password es requerido"}).min(8).max(128)
});
export const UserSearchSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().max(100).optional(),
    email: z.email().optional(),

    pagination: z.object({
        page: z.number().int().min(1).default(1),
        size: z.number().int().min(1).max(100).default(5)
    })
});
export type UserCreateRequest = z.infer<typeof UserCreateSchema>;
export type UserSearchRequest = z.infer<typeof UserSearchSchema>;