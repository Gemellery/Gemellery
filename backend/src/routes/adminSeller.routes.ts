import { Router } from "express";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";
import { getAllSellers, updateSellerStatus } from "../controllers/adminSeller.controller";

const router = Router();

router.get(
    "/pending-sellers",
    authGuard,
    authorizeRole("admin", "super_admin"),
    getAllSellers
);

router.put(
    "/seller/:seller_id/status",
    authGuard,
    authorizeRole("admin", "super_admin"),
    updateSellerStatus
);

export default router;