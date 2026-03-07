import { Request, Response } from "express";
import pool from "../database";

export const getAllSellers = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query(`
            SELECT 
                s.seller_id,
                s.business_name,
                s.business_reg_no,
                s.ngja_registration_no,
                s.seller_license_url,
                s.verification_status,
                u.email,
                u.full_name,
                u.mobile
            FROM seller s
            JOIN user u ON s.seller_id = u.user_id
            ORDER BY s.verification_status ASC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
    const { seller_id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "suspended"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        await pool.query(
            "UPDATE seller SET verification_status = ? WHERE seller_id = ?",
            [status, seller_id]
        );

        res.json({ message: `Seller ${status} successfully` });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};