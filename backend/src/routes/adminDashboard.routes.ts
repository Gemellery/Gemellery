import express from "express";
import {
    getDashboardStats,
    getMonthlyOrders,
    getTotalRevenue,
    getOrdersToday
} from "../controllers/adminDashboard.controller";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);
router.get("/monthly-orders", getMonthlyOrders);
router.get("/total-revenue", getTotalRevenue);
router.get("/orders-today", getOrdersToday);

export default router;