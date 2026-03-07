import express from "express";
import {
    getSystemSettings,
    toggleMaintenance,
} from "../controllers/systemSettings.controller";

const router = express.Router();

router.get("/", getSystemSettings);
router.patch("/maintenance", toggleMaintenance);

export default router;