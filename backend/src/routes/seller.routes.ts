import { Router } from "express";
import {
    getSellerProfile,
    updateSellerProfile,
    getSellerGems,
    getRecentSellerGems
} from "../controllers/seller.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get(
    "/profile",
    authGuard,
    authorizeRole("seller"),
    getSellerProfile
);

router.patch(
    "/profile",
    authGuard,
    authorizeRole("seller"),
    updateSellerProfile
);

router.get(
    "/gems",
    authGuard,
    authorizeRole("seller"),
    getSellerGems
);

router.get(
    "/gems/recent",
    authGuard,
    authorizeRole("seller"),
    getRecentSellerGems
);

export default router;
