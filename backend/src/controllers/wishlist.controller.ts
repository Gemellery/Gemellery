import { Request, Response } from "express";
import pool from "../database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ============================================================
// Get all wishlist items for logged-in user
// ============================================================
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        w.wishlist_id,
        w.gem_id,
        w.added_date,
        g.gem_name,
        g.gem_type,
        g.price,
        g.carat,
        g.color,
        g.cut,
        g.clarity,
        g.origin,
        g.verification_status,
        gi.image_url
      FROM wishlist w
      JOIN gem g ON w.gem_id = g.gem_id
      LEFT JOIN (
        SELECT gem_id, MIN(image_url) AS image_url
        FROM gem_images
        GROUP BY gem_id
      ) gi ON g.gem_id = gi.gem_id
      WHERE w.user_id = ?
      ORDER BY w.added_date DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      items: rows,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// ============================================================
// POST /api/wishlist — Add a gem to wishlist
// ============================================================
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { gem_id } = req.body;

    // Validate input
    if (!gem_id) {
      return res.status(400).json({ message: "gem_id is required" });
    }

    // Check if gem exists
    const [gemRows] = await pool.query<RowDataPacket[]>(
      "SELECT gem_id FROM gem WHERE gem_id = ?",
      [gem_id]
    );

    if (gemRows.length === 0) {
      return res.status(404).json({ message: "Gem not found" });
    }

    // Check if already in wishlist
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT wishlist_id FROM wishlist WHERE user_id = ? AND gem_id = ?",
      [userId, gem_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Gem already in wishlist" });
    }

    // Insert into wishlist
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO wishlist (user_id, gem_id) VALUES (?, ?)",
      [userId, gem_id]
    );

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlist_id: result.insertId,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// ============================================================
// DELETE /api/wishlist/:gem_id — Remove a gem from wishlist
// ============================================================
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const gemId = req.params.gem_id;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM wishlist WHERE user_id = ? AND gem_id = ?",
      [userId, gemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

// ============================================================
// GET /api/wishlist/check/:gem_id — Check if a gem is wishlisted
// ============================================================
export const checkWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const gemId = req.params.gem_id;

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT wishlist_id FROM wishlist WHERE user_id = ? AND gem_id = ?",
      [userId, gemId]
    );

    return res.status(200).json({
      isWishlisted: rows.length > 0,
    });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return res.status(500).json({ message: "Failed to check wishlist" });
  }
};