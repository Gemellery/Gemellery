import { Request, Response } from "express";
import db from "../database";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.query(`
            SELECT 
                u.user_id,
                u.full_name,
                u.email,
                u.mobile,
                u.role,
                u.status,
                u.joined_date,
                c.country_name,

                -- Seller fields (join using seller_id = user_id)
                s.business_name,
                s.business_reg_no,
                s.ngja_registration_no,
                s.verification_status AS seller_verification_status,
                s.seller_license_url,

                -- Buyer activity
                (SELECT COUNT(*) 
                 FROM orders o 
                 WHERE o.buyer_id = u.user_id) AS orders_placed,

                -- Seller activity
                (SELECT COUNT(*) 
                 FROM orders o 
                 WHERE o.seller_id = u.user_id) AS orders_received

            FROM user u
            LEFT JOIN country c ON u.country_id = c.country_id
            LEFT JOIN seller s ON s.seller_id = u.user_id
            ORDER BY u.joined_date DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error("SQL ERROR:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["active", "inactive", "frozen"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const [result]: any = await db.query(
            `UPDATE user 
             SET status = ?, updated_at = NOW() 
             WHERE user_id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User status updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update status" });
    }
};