import { Request, Response } from "express";
import pool from "../database";

export const getAllGemsForReview = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await pool.query(`
            SELECT 
                g.gem_id,
                g.gem_name,
                g.ngja_certificate_no,
                g.ngja_certificate_url,
                g.gem_type,
                g.price,
                g.carat,
                g.color,
                g.cut,
                g.clarity,
                g.origin,
                g.verification_status,
                g.created_at,
                s.business_name
            FROM gem g
            JOIN seller s ON g.seller_id = s.seller_id
            ORDER BY g.verification_status ASC, g.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const updateGemStatus = async (req: Request, res: Response) => {
    const { gem_id } = req.params;
    const { status, admin_comment } = req.body;

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        await pool.query(
            `UPDATE gem 
             SET verification_status = ?, admin_comment = ?
             WHERE gem_id = ?`,
            [status, admin_comment || null, gem_id]
        );

        res.json({ message: `Gem ${status} successfully` });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};