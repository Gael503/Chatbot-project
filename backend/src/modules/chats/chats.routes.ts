import { Router } from "express";
const router = Router();
import { validateBody } from "~/middleware/ValidateRequest";
import { Contacts, History } from "./chats.controller";
import { ContactsSchema, HistorySchema } from "./dto/chat.schema";

router.post("/", validateBody(ContactsSchema), Contacts)
router.post("/history", validateBody(HistorySchema), History)

export default router;