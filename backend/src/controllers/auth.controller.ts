import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";

const allowedRoles = ["buyer", "seller"];

export const register = async (req: Request, res: Response) => {
    const {
        email,
        password,
        role,
        full_name = null,
        mobile = null,
        country_id = null,
        address = null,
        business_name,
        business_reg_no,
        ngja_registration_no,
    } = req.body;

    if (!email || !password || !role || (role === "seller" && !business_name) || (role === "seller" && !business_reg_no) || (role === "seller" && !ngja_registration_no)) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "seller" && !req.file) {
        return res.status(400).json({
            message: "Seller license is required"
        })
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult]: any = await pool.query(
            `INSERT INTO user
            (email, password, role, full_name, mobile, joined_date, country_id)
            VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
            [email, hashedPassword, role, full_name, mobile, country_id]
        );

        const user_id = userResult.insertId;

        if (role === "seller") {
            const licenseUrl = req.file
                ? `/uploads/licenses/${req.file.filename}`
                : null;

            await conn.query(
                `INSERT INTO seller
     (seller_id, business_name, business_reg_no, ngja_registration_no, seller_license_url)
     VALUES (?, ?, ?, ?, ?)`,
                [user_id, business_name, business_reg_no, ngja_registration_no, licenseUrl]
            );
        }
// edited pool to conn
        if (address) {
            await conn.query(
                `INSERT INTO address (address, user_id) VALUES (?, ?)`,
                [address, user_id]
            );
        }

        await conn.commit();
        return res.status(201).json({ message: "Account created successfully" });


    } catch (err: any) {
        await conn.rollback();

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
        }

        if (err.code === "ER_DATA_TOO_LONG") {
            return res.status(400).json({ message: "Input data is too long" });
        }

        console.error(err);
        return res.status(500).json({ message: "Server error" });
    } finally {
        conn.release();
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const [rows]: any = await pool.query(
        "SELECT * FROM user WHERE LOWER(email) = LOWER(?) AND role = ?",
        [email, role]
    );


    if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );


    res.json({
        token,
        user: {
            id: user.user_id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
        },
    });

};
