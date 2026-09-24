import { check } from "express-validator";

export const UserCreateSchema = [
    check("name", "Name es requerido").isString().isLength({ min: 2, max: 100 }),
    check("email").isEmail().isLength({ max: 255 }),
    check("password", "Password es requerido").isString().isLength({ min: 8, max: 128 })
];

export const UserSearchSchema = [
    check("id").optional().isInt().toInt(),
    check("name").optional().isString().isLength({ max: 100 }),
    check("email").optional().isLength({ max: 50 }).withMessage('Email debe tener máximo 50 caracteres').trim().escape(),

    check("pagination.page").optional().isInt({ min: 1 }).toInt().default(1),
    check("pagination.size").optional().isInt({ min: 1, max: 100 }).toInt().default(5)
];