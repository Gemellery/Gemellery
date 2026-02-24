import { Router } from "express";
import {
  getBuyerDashboardSummary,
  getRecentOrders,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/buyer.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/dashboard-summary",
  authGuard,
  authorizeRole("buyer"),
  getBuyerDashboardSummary
);

router.get(
  "/orders/recent",
  authGuard,
  authorizeRole("buyer"),
  getRecentOrders
);

router.get(
  "/wishlist",
  authGuard,
  authorizeRole("buyer"),
  getWishlist
);

router.post(
  "/wishlist",
  authGuard,
  authorizeRole("buyer"),
  addToWishlist
);

router.delete(
  "/wishlist/:id",
  authGuard,
  authorizeRole("buyer"),
  removeFromWishlist
);

export default router;
