import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, banUser, unbanUser } from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.patch("/ban/:userId", protectRoute, requireAdmin, banUser);
router.patch("/unban/:userId", protectRoute, requireAdmin, unbanUser);

export default router;