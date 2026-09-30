import { check } from "express-validator";

export const searchPromptsValidation = [
    check("promptId").optional().isInt().toInt(),
    check("pagination.page").optional().isInt({ min: 1 }).toInt().default(1),
    check("pagination.size").optional().isInt({ min: 1, max: 100 }).toInt().default(5)
];
