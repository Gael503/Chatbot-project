import { Router } from "express";
import { UserCreateSchema, UserSearchSchema } from "./dto/user.schema";
import { CreateUser, SearchUsers, DeactivateUser } from "./users.controller";
const router = Router();
import { validateBody } from "~/middleware/ValidateRequest";

router.post("/search", validateBody(UserSearchSchema), SearchUsers)
router.post("/", validateBody(UserCreateSchema), CreateUser)
router.patch("/:id/deactivate", DeactivateUser)

export default router;