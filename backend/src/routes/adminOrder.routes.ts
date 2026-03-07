import express from "express";
import {
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    getOrderStatusHistory,
} from "../controllers/adminOrder.controller";

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id/history", getOrderStatusHistory);
router.put("/:id/status", updateOrderStatus);
router.get("/:id", getOrderDetails);

export default router;