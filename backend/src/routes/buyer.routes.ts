import { Router } from "express";
import {
  getBuyerDashboardSummary,
  getRecentOrders,
  getAllOrders,
  getOrderDetails,
  downloadOrderReceipt,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getBuyerProfile,
  updateBuyerProfile,
} from "../controllers/buyer.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/profile",
  authGuard,
  authorizeRole("buyer"),
  getBuyerProfile
);

router.patch(
  "/profile",
  authGuard,
  authorizeRole("buyer"),
  updateBuyerProfile
);

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
  "/orders/history",
  authGuard,
  authorizeRole("buyer"),
  getAllOrders
);

router.get(
  "/orders/:id",
  authGuard,
  authorizeRole("buyer"),
  getOrderDetails
);

router.get(
  "/orders/:id/receipt",
  authGuard,
  authorizeRole("buyer"),
  downloadOrderReceipt
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

// Review endpoints
import {
  getPendingReviews,
  getCompletedReviews,
  updateReview,
  getBuyerCertificates,
  claimNFT,
} from "../controllers/buyer.controller";

router.get(
  "/reviews/pending",
  authGuard,
  authorizeRole("buyer"),
  getPendingReviews
);

router.get(
  "/reviews/completed",
  authGuard,
  authorizeRole("buyer"),
  getCompletedReviews
);

router.put(
  "/reviews/:id",
  authGuard,
  authorizeRole("buyer"),
  updateReview
);

// Blockchain certificate endpoints
router.get(
  "/certificates",
  authGuard,
  authorizeRole("buyer"),
  getBuyerCertificates
);

router.post(
  "/certificates/claim",
  authGuard,
  authorizeRole("buyer"),
  claimNFT
);

export default router;
