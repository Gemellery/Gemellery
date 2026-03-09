import express from "express";
import {
    salesReport,
    salesCSV,
    sellerPerformanceReport,
    sellerPerformanceCSV,
    userActivityReport,
    userActivityCSV,
    orderStatusReport,
    orderStatusCSV,
    sellerRatingsReport,
    sellerRatingsCSV
} from "../controllers/report.controller";

const router = express.Router();

router.get("/sales", salesReport);
router.get("/sales/csv", salesCSV);

router.get("/seller-performance", sellerPerformanceReport);
router.get("/seller-performance/csv", sellerPerformanceCSV);

router.get("/user-activity", userActivityReport);
router.get("/user-activity/csv", userActivityCSV);

router.get("/order-status", orderStatusReport);
router.get("/order-status/csv", orderStatusCSV);

router.get("/seller-ratings", sellerRatingsReport);
router.get("/seller-ratings/csv", sellerRatingsCSV);

export default router;