import { Router } from "express";
import { checkoutOrder, createPaymentIntent } from "../controllers/order.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/payment-intent",
  authGuard,
  authorizeRole("buyer"),
  createPaymentIntent
);

router.post(
  "/checkout",
  authGuard,
  authorizeRole("buyer"),
  checkoutOrder
);

export default router;