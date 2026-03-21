import { Request, Response } from "express";
import db from "../database";

export const getSystemSettings = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.query(
            "SELECT maintenance_mode, maintenance_message FROM system_settings LIMIT 1"
        );

        res.json({
            success: true,
            data: rows[0],
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to load settings" });
    }
};

export const toggleMaintenance = async (req: Request, res: Response) => {
    const { maintenance_mode } = req.body;

    try {
        await db.query(
            "UPDATE system_settings SET maintenance_mode=? WHERE id=1",
            [maintenance_mode]
        );

        res.json({
            success: true,
            message: "Maintenance mode updated",
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to update maintenance mode",
        });
    }
};