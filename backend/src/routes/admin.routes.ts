import express from "express";
import { authGuard } from "../middleware/auth.middleware";
import { getAdminProfile } from "../controllers/admin.controller";

const router = express.Router();

router.get("/profile", authGuard, getAdminProfile);

export default router;