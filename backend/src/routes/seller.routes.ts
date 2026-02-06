import { Router } from "express";
import {
    getSellerProfile,
    updateSellerProfile
} from "../controllers/seller.controller";
import { authGuard } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authGuard, getSellerProfile);
router.patch("/profile", authGuard, updateSellerProfile);

export default router;
