import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database";

export const reAuthenticateSuperAdmin = async (
    req: any,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role.toLowerCase() !== "super_admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const { password } = req.body;

        const [rows]: any = await pool.query(
            "SELECT password FROM user WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, rows[0].password);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.json({ success: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};