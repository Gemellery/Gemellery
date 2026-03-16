import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";
import { OAuth2Client } from "google-auth-library";
import path from "path";

import crypto from "crypto";
import { createResetToken } from "../models/passwordReset.model";
import { sendEmail } from "../utils/mailer";

import {
    findResetToken,
    deleteResetToken
} from "../models/passwordReset.model";

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

    if (
        !email ||
        !password ||
        !role ||
        (role === "seller" && !business_name) ||
        (role === "seller" && !business_reg_no) ||
        (role === "seller" && !ngja_registration_no)
    ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "seller" && !req.file) {
        return res.status(400).json({
            message: "Seller license is required"
        });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult]: any = await conn.query(
            `INSERT INTO user
            (email, password, role, full_name, mobile, joined_date, country_id)
            VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
            [email, hashedPassword, role, full_name, mobile, country_id]
        );

        const user_id = userResult.insertId;

        if (address) {
            await conn.query(
                `INSERT INTO address (address, user_id)
                 VALUES (?, ?)`,
                [address, user_id]
            );
        }

        if (role === "seller") {

            const normalizedBusiness = business_name.trim().toUpperCase();
            const normalizedNgja = ngja_registration_no.trim().toUpperCase();

            const [existingSeller]: any = await conn.query(
                "SELECT * FROM seller WHERE ngja_registration_no = ?",
                [normalizedNgja]
            );

            if (existingSeller.length > 0) {
                await conn.rollback();
                return res.status(400).json({
                    message: "This NGJA license is already registered"
                });
            }

            const [ngjaRows]: any = await conn.query(
                `SELECT *
                 FROM ngja_registered_sellers
                 WHERE ngja_registration_no = ?
                 AND UPPER(business_name) = ?`,
                [normalizedNgja, normalizedBusiness]
            );

            let verificationStatus = "pending";

            if (ngjaRows.length > 0) {
                const expireDate = new Date(ngjaRows[0].license_expire_date);
                if (expireDate >= new Date()) {
                    verificationStatus = "approved";
                }
            }

            const licenseUrl = req.file
                ? (req.file as any).location
                : null;

            await conn.query(
                `INSERT INTO seller
                (seller_id, business_name, business_reg_no, ngja_registration_no, seller_license_url, verification_status)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    user_id,
                    normalizedBusiness,
                    business_reg_no,
                    normalizedNgja,
                    licenseUrl,
                    verificationStatus
                ]
            );
        }

        await conn.commit();

        return res.status(201).json({
            message: "Account created successfully"
        });

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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    const [rows]: any = await pool.query(
        "SELECT * FROM user WHERE LOWER(email) = LOWER(?)",
        [email]
    );

    if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role.toLowerCase() === "seller") {
        const [sellerRows]: any = await pool.query(
            "SELECT verification_status FROM seller WHERE seller_id = ?",
            [user.user_id]
        );

        if (!sellerRows.length || sellerRows[0].verification_status !== "approved") {
            return res.status(403).json({
                message: "Your seller account is pending admin approval"
            });
        }
    }

    const token = jwt.sign(
        {
            id: user.user_id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    res.json({
        token,
        user: {
            id: user.user_id,
            email: user.email,
            role: user.role.toLowerCase(),
            full_name: user.full_name,
        },
    });
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const [users]: any = await pool.query(
        "SELECT user_id FROM user WHERE email = ?",
        [email]
    );

    if (users.length > 0) {
        await pool.query(
            "DELETE FROM password_resets WHERE email = ?",
            [email]
        );

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await createResetToken(email, token, expiresAt);

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
                    .header { text-align: center; padding-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; text-decoration: none; }
                    .content { padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
                    .button { display: inline-block; padding: 12px 24px; background-color: #1560ac; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
                    .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
                    .warning { font-size: 12px; color: #999; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="cid:logo" alt="Gemellery Logo" style="max-height: 80px; width: auto;" />
                    </div>
                    <div class="content">
                        <h1 style="text-align: center;">Reset Your Password</h1>
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Gemellery account. Click the button below to set a new one:</p>
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="button">Reset Password</a>
                        </div>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666; font-size: 14px;">${resetLink}</p>
                        <div class="warning">
                            <p>This link will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Gemellery. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const logoPath = "c:\\Users\\ASUS\\Desktop\\My Projects\\My projects\\Gemellery\\frontend\\src\\assets\\logos\\Elegance Jewelry.png";

        await sendEmail(
            email,
            "Reset your Gemellery password",
            `Reset your password here: ${resetLink}`,
            htmlContent,
            [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'logo' // same cid as in the html img src
                }
            ]
        );
    }

    res.json({
        message: "If this email exists, a reset link was sent."
    });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const reset = await findResetToken(token);

    if (!reset || new Date(reset.expires_at) < new Date()) {
        return res.status(400).json({
            message: "Invalid or expired reset token"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        "UPDATE user SET password = ? WHERE email = ?",
        [hashedPassword, reset.email]
    );

    await deleteResetToken(token);

    res.json({
        message: "Password reset successful"
    });
};

/**
 * POST /api/auth/google
 * Authenticates user via Google OAuth (supports implicit and ID token flows).
 */
export const googleLogin = async (req: Request, res: Response) => {
    const { credential, profile } = req.body;

    if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
    }

    let googleId: string;
    let email: string;
    let fullName: string;

    try {
        if (profile) {
            googleId = profile.sub;
            email    = profile.email;
            fullName = profile.name || "";
        } else {
            const client = new OAuth2Client();
            const ticket = await client.verifyIdToken({ idToken: credential });
            const payload = ticket.getPayload();

            if (!payload) return res.status(401).json({ message: "Invalid Google token" });

            googleId = payload.sub;
            email    = payload.email!;
            fullName = payload.name || "";
        }

        if (!email || !googleId) {
            return res.status(400).json({ message: "Could not read Google account info" });
        }

        const [googleRows]: any = await pool.query(
            "SELECT * FROM user WHERE google_id = ?",
            [googleId]
        );

        let user;
        if (googleRows.length > 0) {
            user = googleRows[0];
        } else {
            const [emailRows]: any = await pool.query(
                "SELECT * FROM user WHERE LOWER(email) = LOWER(?)",
                [email]
            );

            if (emailRows.length > 0) {
                user = emailRows[0];
                await pool.query(
                    "UPDATE user SET google_id = ? WHERE user_id = ?",
                    [googleId, user.user_id]
                );
            } else {
                const [insertResult]: any = await pool.query(
                    `INSERT INTO user (email, password, role, full_name, google_id, joined_date)
                     VALUES (?, ?, 'buyer', ?, ?, CURDATE())`,
                    [email, "", fullName, googleId]
                );

                const [newUser]: any = await pool.query(
                    "SELECT * FROM user WHERE user_id = ?",
                    [insertResult.insertId]
                );
                user = newUser[0];
            }
        }

        if (user.role.toLowerCase() === "seller") {
            const [sellerRows]: any = await pool.query(
                "SELECT verification_status FROM seller WHERE seller_id = ?",
                [user.user_id]
            );

            if (!sellerRows.length || sellerRows[0].verification_status !== "approved") {
                return res.status(403).json({ message: "Your seller account is pending admin approval" });
            }
        }

        const token = jwt.sign(
            { id: user.user_id, role: user.role, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id:        user.user_id,
                email:     user.email,
                role:      user.role.toLowerCase(),
                full_name: user.full_name,
            },
        });
    } catch (err: any) {
        console.error("Google login error:", err);
        return res.status(500).json({ message: "Google authentication failed" });
    }
};
