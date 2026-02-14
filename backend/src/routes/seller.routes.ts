import { Router } from "express";
import {
    getSellerProfile,
    updateSellerProfile,
    getSellerGems,
    getRecentSellerGems
} from "../controllers/seller.controller";
import { authGuard } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authGuard, getSellerProfile);
router.patch("/profile", authGuard, updateSellerProfile);
router.get("/gems", authGuard, getSellerGems);
router.get("/gems/recent", authGuard, getRecentSellerGems);

export default router;
