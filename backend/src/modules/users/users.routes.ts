import { Router } from "express";
import { CreateUser, SearchUsers } from "./users.controller";
const router = Router();

router.post("/search", SearchUsers)
router.post("/", CreateUser)

export default router;