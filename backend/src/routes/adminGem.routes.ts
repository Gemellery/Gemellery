import { Router } from "express";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";
import { getAllGemsForReview, updateGemStatus } from "../controllers/adminGem.controller";

const router = Router();

router.get(
    "/gems",
    authGuard,
    authorizeRole("admin", "super_admin"),
    getAllGemsForReview
);

router.put(
    "/gem/:gem_id/status",
    authGuard,
    authorizeRole("admin", "super_admin"),
    updateGemStatus
);

export default router;