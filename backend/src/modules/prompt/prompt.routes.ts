import { Router } from "express";
const router = Router();
import { CurrentPrompt, PromptsList, UpdatePrompt, CreatePrompt } from "./prompt.controller";
import { validateBody } from "~/middleware/ValidateRequest";

router.get("/", CurrentPrompt)
router.post("/search", PromptsList)
router.patch("/", UpdatePrompt)
router.post("/", CreatePrompt)

export default router;