import { Request, Response } from "express";
import pool from "../database";

export const getAdminProfile = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [rows]: any = await pool.query(
            `
            SELECT 
                u.email,
                u.full_name,
                u.mobile,
                u.role,
                u.status,
                u.joined_date,
                u.updated_at,
                c.country_name AS country
            FROM user u
            LEFT JOIN country c ON u.country_id = c.country_id
            WHERE u.user_id = ?
            `,
            [userId]
        );

        res.json(rows[0]);

    } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Failed to load profile" });
    }
};