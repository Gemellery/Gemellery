import { Request, Response } from "express";
import db from "../database";

export const getSellerProfile = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userId = req.user!.id;

    const [rows]: any = await db.query(
        `
        SELECT
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.joined_date,

        c.country_name,

        s.business_name,
        s.business_reg_no,
        s.ngja_registration_no,
        s.seller_license_url,

        a.address
        FROM user u
        JOIN seller s ON s.seller_id = u.user_id
        LEFT JOIN address a ON a.user_id = u.user_id
        LEFT JOIN country c ON c.country_id = u.country_id
        WHERE u.user_id = ? AND u.role = 'Seller'
        `,
        [userId]
    );

    if (!rows.length) {
        return res.status(403).json({ error: "Not a seller" });
    }

    return res.json(rows[0]);
};

export const updateSellerProfile = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const userId = req.user!.id;
    const { full_name, mobile, address } = req.body;

    await db.query(
        `
        UPDATE user
        SET full_name = ?, mobile = ?
        WHERE user_id = ? AND role = 'Seller'
        `,
        [full_name, mobile, userId]
    );

    await db.query(
        `
        UPDATE address
        SET address = ?
        WHERE user_id = ?
        `,
        [address, userId]
    );

    return res.json({ message: "Profile updated successfully" });
};
export const getSellerGems = async (req: Request, res: Response) => {
    try {
        const sellerId = (req.user as any).id;

        const [rows]: any = await db.query(
            `
      SELECT
        g.gem_id,
        g.gem_name,
        g.carat,
        g.cut,
        g.price,
        MIN(gi.image_url) AS image_url
      FROM gem g
      LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
      WHERE g.seller_id = ?
        AND g.status = 'Available'
      GROUP BY g.gem_id
      ORDER BY g.gem_id DESC
      `,
            [sellerId]
        );

        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: "Failed to load gems" });
    }
};

export const getRecentSellerGems = async (req: Request, res: Response) => {
    try {
        const sellerId = (req.user as any).id;

        const [rows]: any = await db.query(
            `
      SELECT
        g.gem_id,
        g.gem_name,
        g.carat,
        g.cut,
        g.price,
        MIN(gi.image_url) AS image_url
      FROM gem g
      LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
      WHERE g.seller_id = ?
        AND g.status = 'Available'
      GROUP BY g.gem_id
      ORDER BY g.gem_id DESC
      LIMIT 4
      `,
            [sellerId]
        );

        return res.json(rows);
    } catch {
        return res.status(500).json({ error: "Failed to load recent gems" });
    }
};
