import { Router } from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../controllers/cart.controller";

import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authGuard, authorizeRole("buyer"), addToCart);
router.get("/", authGuard, authorizeRole("buyer"), getCart);
router.put("/", authGuard, authorizeRole("buyer"), updateCartItem);
router.delete("/:cart_item_id", authGuard, authorizeRole("buyer"), removeCartItem);

export default router;