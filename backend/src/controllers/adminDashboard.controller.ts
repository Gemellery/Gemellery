import { Request, Response } from "express";
import pool from "../database";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {

        const [totalUsers]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM user"
        );

        const [totalGems]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM gem"
        );

        const [pendingVerifications]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM seller WHERE verification_status = 'pending'"
        );

        const [pendingGemApprovals]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM gem WHERE verification_status = 'pending'"
        );

        const [totalOrders]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM orders"
        );

        res.json({
            totalUsers: totalUsers[0].count,
            totalGems: totalGems[0].count,
            pendingVerifications: pendingVerifications[0].count,
            pendingGemApprovals: pendingGemApprovals[0].count,
            totalOrders: totalOrders[0].count,
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Failed to load dashboard stats" });
    }
};
