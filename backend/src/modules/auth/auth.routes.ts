import { Router } from "express";
import { Login } from "./auth.controller";
const router = Router();

router.post("/", Login)

export default router;