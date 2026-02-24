import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../database";

/* ===========================
   RE-AUTHENTICATE
=========================== */
export const reAuthenticateSuperAdmin = async (
    req: any,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (req.user.role !== "Super_Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password required",
            });
        }

        const [rows]: any = await pool.query(
            "SELECT password FROM user WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const match = await bcrypt.compare(password, rows[0].password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        return res.json({
            success: true,
            message: "Re-authentication successful",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ===========================
   CREATE ADMIN
=========================== */
export const createAdmin = async (req: any, res: Response) => {
    try {
        const { email, password, full_name, mobile, country_id } = req.body;

        if (!email || !password || !full_name || !country_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Check duplicate email
        const [existing]: any = await pool.query(
            "SELECT user_id FROM user WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `
      INSERT INTO user
        (email, password, full_name, mobile, role, status, joined_date, country_id)
      VALUES
        (?, ?, ?, ?, 'Admin', 'active', NOW(), ?)
      `,
            [email, hashedPassword, full_name, mobile, country_id]
        );

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

/* ===========================
   GET ADMINS
=========================== */
export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        let condition = "u.role = 'Admin'";
        const params: any[] = [];

        if (status && status !== "all") {
            condition += " AND u.status = ?";
            params.push(status);
        } else {
            // default behavior → hide inactive
            condition += " AND u.status != 'inactive'";
        }

        const [admins]: any = await pool.query(
            `
      SELECT 
        u.user_id,
        u.email,
        u.full_name,
        u.mobile,
        u.status,
        u.joined_date,
        u.country_id,
        c.country_name
      FROM user u
      LEFT JOIN country c ON u.country_id = c.country_id
      WHERE ${condition}
      ORDER BY u.joined_date DESC
      `,
            params
        );

        res.json({
            success: true,
            data: admins,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

/* ===========================
   EDIT ADMIN
=========================== */
export const editAdmin = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { email, password, full_name, mobile, country_id } = req.body;

        // Check duplicate email
        const [existing]: any = await pool.query(
            "SELECT user_id FROM user WHERE email = ? AND user_id != ?",
            [email, id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        let query = `
      UPDATE user SET 
        email = ?, 
        full_name = ?, 
        mobile = ?, 
        country_id = ?, 
        updated_at = NOW()
    `;

        const params: any[] = [email, full_name, mobile, country_id];

        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            query += `, password = ?`;
            params.push(hashed);
        }

        query += ` WHERE user_id = ? AND role = 'Admin'`;
        params.push(id);

        await pool.query(query, params);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

/* ===========================
   TOGGLE STATUS
=========================== */
export const updateAdminStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.query(
            `UPDATE user SET status = ? WHERE user_id = ? AND role = 'Admin'`,
            [status, id]
        );

        return res.json({ success: true });

    } catch {
        return res.status(500).json({ success: false });
    }
};

/* ===========================
   FREEZE ACCOUNT
=========================== */
export const freezeAccount = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const [target]: any = await pool.query(
            "SELECT role FROM user WHERE user_id = ?",
            [id]
        );

        if (target[0].role === "Super_Admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot freeze Super Admin",
            });
        }

        await pool.query(
            "UPDATE user SET status = 'frozen' WHERE user_id = ?",
            [id]
        );

        return res.json({ success: true });

    } catch {
        return res.status(500).json({ success: false });
    }
};

/* ===========================
   REMOVE ADMIN
=========================== */
export const removeAdmin = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "Cannot remove yourself",
            });
        }

        await pool.query(
            `UPDATE user SET status = 'inactive'
       WHERE user_id = ? AND role = 'Admin'`,
            [id]
        );

        return res.json({ success: true });

    } catch {
        return res.status(500).json({ success: false });
    }
};