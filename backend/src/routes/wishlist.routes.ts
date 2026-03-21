import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../controllers/wishlist.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

// All routes require: logged in + buyer role
router.get("/",           authGuard, authorizeRole("buyer"), getWishlist);
router.post("/",          authGuard, authorizeRole("buyer"), addToWishlist);
router.delete("/:gem_id", authGuard, authorizeRole("buyer"), removeFromWishlist);
router.get("/check/:gem_id", authGuard, authorizeRole("buyer"), checkWishlist);

export default router;