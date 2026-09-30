import { Router, Request, Response, NextFunction } from "express";
const router = Router();
import { CurrentPrompt, PromptsList, CreatePrompt, ActivatePrompt } from "./prompt.controller";
import { validateBody } from "~/middleware/ValidateRequest";
import { searchPromptsValidation } from "./dto/prompt.schema";
import multer, { FileFilterCallback } from "multer";
import { BaseResponse } from "~/shared";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 }, // 1MB
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (file.mimetype !== "text/plain") {
            return cb(new Error("Solo se permiten archivos .txt"));
        }
        cb(null, true);
    }
});

const uploadPromptFile = (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (error: unknown) => {
        if (!error) return next();
        const response = new BaseResponse();
        response.setErrorResponse({
            message: error instanceof Error ? error.message : "Error al subir el archivo"
        });
        return res.status(response.code).send(response);
    });
};

router.get("/", CurrentPrompt)
router.post("/search", validateBody(searchPromptsValidation), PromptsList)
router.post("/", uploadPromptFile, CreatePrompt)
router.put("/activate/:id", ActivatePrompt)

export default router;