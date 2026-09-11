import * as z from "zod";

export const ContactsSchema = z.object({
    id: z.number().positive().optional(),
    created_at: z.date().optional(),

    pagination: z.object({
        page: z.number().int().min(1).default(1),
        size: z.number().int().min(1).max(100).default(5)
    })
});

export const HistorySchema = z.object({
    idContact: z.number({message: "idContact es requerido"}).positive(),

    pagination: z.object({
        page: z.number({message: "Page debe ser > 0"}).int().min(1).default(1),
        size: z.number({message: "Size debe ser > 0"}).int().min(1).max(30).default(5)
    })
});

export type ContactsRequest = z.infer<typeof ContactsSchema>;
export type HistoryRequest = z.infer<typeof HistorySchema>;