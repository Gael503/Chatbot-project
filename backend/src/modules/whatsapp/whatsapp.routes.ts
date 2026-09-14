import { Router } from "express";
const router = Router();
import { GetQr } from "./whatsapp.controller";

router.get("/qr", GetQr)

export default router;