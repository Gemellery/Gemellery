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
        address_id = null,
    } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            `INSERT INTO user
       (email, password, role, full_name, mobile, joined_date, country_id, address_id)
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?)`,
            [
                email,
                hashedPassword,
                role,
                full_name,
                mobile,
                country_id,
                address_id,
            ]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err: any) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
        }

        console.error(err);
        res.status(500).json({ message: "Server error" });
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
