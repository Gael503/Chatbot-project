import { Router } from "express";
import { Request, Response } from "express";
import { BaseResponse } from "~/shared";
//modules
import AuthRoutes from "./auth/auth.routes"
import UserRoutes from "./users/users.routes"
//main code
const router = Router();

router.get("/health", (req: Request, res: Response) =>{
    const response = new BaseResponse();
    response.setSuccessResponse()
    return res.status(response.code).json(response)
})

router.use("/auth", AuthRoutes)
router.use("/users", UserRoutes)

export default router;