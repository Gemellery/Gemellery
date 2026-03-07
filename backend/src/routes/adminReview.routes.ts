import { Router } from "express";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";
import {
    getAllSellerReviews,
    deleteSellerReview
} from "../controllers/adminReview.controller";

const router = Router();

router.get(
    "/reviews",
    authGuard,
    authorizeRole("admin", "super_admin"),
    getAllSellerReviews
);

router.delete(
    "/review/:review_id",
    authGuard,
    authorizeRole("admin", "super_admin"),
    deleteSellerReview
);

export default router;