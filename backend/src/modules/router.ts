import { Router } from "express";
import { Request, Response } from "express";
import { BaseResponse } from "~/shared";
const router = Router();

router.get("/health", (req: Request, res: Response) =>{
    const response = new BaseResponse();
    response.success_response()
    return res.status(response.code).json(response)
})

export default router;