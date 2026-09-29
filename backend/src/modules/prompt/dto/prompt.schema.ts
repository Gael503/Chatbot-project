import { check } from "express-validator";

export const searchPromptsValidation = [
    check("promptId").optional().isInt().toInt(),
    check("pagination.page").optional().isInt({ min: 1 }).toInt().default(1),
    check("pagination.size").optional().isInt({ min: 1, max: 100 }).toInt().default(5)
];

export const CreatePromptValidation = [
    check("content", "El contenido es requerido")
        .isString()
        .isLength({ min: 20 })
        .withMessage('EL contenido es muy corto min 20 caracteres')
        .isLength({ max: 500 })
        .withMessage('EL contenido es muy largo max 500 caracteres')
        .trim().escape(),
]