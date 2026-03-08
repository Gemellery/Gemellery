import { Router } from "express";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";
import { 
    getAllGemsForReview, 
    updateGemStatus,
    retryMintGem,
    getBlockchainServiceStatus 
} from "../controllers/adminGem.controller";

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

router.post(
    "/gem/:gem_id/retry-mint",
    authGuard,
    authorizeRole("admin", "super_admin"),
    retryMintGem
);

router.get(
    "/blockchain-status",
    authGuard,
    authorizeRole("admin", "super_admin"),
    getBlockchainServiceStatus
);

export default router;