import { body } from "express-validator";

export const ContactsSchema = [
    body("id").optional().isInt({ min: 1 }).toInt(),
    body("created_at").optional().isISO8601().toDate(),

    body("pagination.page").optional().isInt({ min: 1 }).toInt().default(1),
    body("pagination.size").optional().isInt({ min: 1, max: 100 }).toInt().default(5)
];

export const HistorySchema = [
    body("idContact", "idContact es requerido").isInt({ min: 1 }).toInt(),

    body("pagination.page", "Page debe ser > 0").optional().isInt({ min: 1 }).toInt().default(1),
    body("pagination.size", "Size debe ser > 0").optional().isInt({ min: 1, max: 30 }).toInt().default(5)
];