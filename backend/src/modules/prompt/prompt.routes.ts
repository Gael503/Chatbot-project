import { Router } from "express";
const router = Router();
import { CurrentPrompt, PromptsList, CreatePrompt, ActivatePrompt } from "./prompt.controller";
import { validateBody } from "~/middleware/ValidateRequest";
import { searchPromptsValidation, CreatePromptValidation } from "./dto/prompt.schema";

router.get("/", CurrentPrompt)
router.post("/search", validateBody(searchPromptsValidation), PromptsList)
router.post("/", validateBody(CreatePromptValidation) ,CreatePrompt)
router.put("/activate/:id", ActivatePrompt)

export default router;