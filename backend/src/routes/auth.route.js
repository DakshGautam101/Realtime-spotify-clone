import { Router } from "express";
import { login, register, getMe } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protectRoute, getMe);

export default router;