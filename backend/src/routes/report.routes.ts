import express from "express";
import {
    salesReport,
    salesCSV,
} from "../controllers/report.controller";

const router = express.Router();

router.get("/sales", salesReport);
router.get("/sales/csv", salesCSV);

export default router;