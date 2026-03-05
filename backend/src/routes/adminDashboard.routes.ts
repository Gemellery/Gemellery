import express from "express";
import { getDashboardStats } from "../controllers/adminDashboard.controller";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);

export default router;