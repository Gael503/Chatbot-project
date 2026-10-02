import { Router } from "express";
const router = Router();
import { GetQr, GetStatus } from "./whatsapp.controller";

router.get("/qr", GetQr)
router.get("/status", GetStatus)

export default router;