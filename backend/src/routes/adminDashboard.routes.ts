import express from "express";
import {
    getDashboardStats,
    getMonthlyOrders,
    getTotalRevenue,
    getOrdersToday,
    getTopGemCategories,
    getSellerGrowth
} from "../controllers/adminDashboard.controller";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);
router.get("/monthly-orders", getMonthlyOrders);
router.get("/total-revenue", getTotalRevenue);
router.get("/orders-today", getOrdersToday);
router.get("/top-gem-categories", getTopGemCategories);
router.get("/seller-growth", getSellerGrowth);

export default router;