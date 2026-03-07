import { Router } from "express";
import {
    getSellerOrders,
    upsertShipment,
    updateShipmentStatus,
} from "../controllers/sellerShipment.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/orders", authGuard, authorizeRole("seller"), getSellerOrders);
router.put("/orders/:orderId/shipment", authGuard, authorizeRole("seller"), upsertShipment);
router.patch("/orders/:orderId/shipment-status", authGuard, authorizeRole("seller"), updateShipmentStatus);

export default router;
