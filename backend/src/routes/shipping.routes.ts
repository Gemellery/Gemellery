import { Router } from "express";
import {
  getShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  setDefaultAddress
} from "../controllers/shipping.controller";
import { authGuard } from "../middleware/auth.middleware";

const router = Router();

router.use(authGuard);

router.get("/", getShippingAddresses);
router.post("/", createShippingAddress);
router.put("/:address_id", updateShippingAddress);
router.patch("/:address_id/set-default", setDefaultAddress);
router.delete("/:address_id", deleteShippingAddress);

export default router;
