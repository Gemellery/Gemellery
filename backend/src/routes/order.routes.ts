import { Router } from "express";
import { checkoutOrder } from "../controllers/order.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/checkout",
  authGuard,
  authorizeRole("buyer"),
  checkoutOrder
);

export default router;