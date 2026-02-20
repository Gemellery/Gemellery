import express from "express";
import { reAuthenticateSuperAdmin } from "../controllers/superAdmin.controller";
import { authGuard } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
    "/re-authenticate",
    authGuard,
    reAuthenticateSuperAdmin
);

export default router;