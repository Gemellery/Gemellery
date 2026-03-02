import { Request, Response } from "express";
import db from "../database";

// GET /api/buyer/dashboard-summary
export const getBuyerDashboardSummary = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    // Active orders: Processing or Shipped
    const [[ordersRow]]: any = await db.query(
      `
        SELECT COUNT(*) AS active_orders
        FROM orders
        WHERE buyer_id = ?
          AND order_status IN ('Processing', 'Shipped')
      `,
      [buyerId]
    );

    // Saved designs
    const [[designsRow]]: any = await db.query(
      `
        SELECT COUNT(*) AS saved_designs
        FROM design
        WHERE buyer_id = ?
      `,
      [buyerId]
    );

    const upcomingAppointments = 0;

    return res.json({
      activeOrders: ordersRow?.active_orders || 0,
      savedDesigns: designsRow?.saved_designs || 0,
      upcomingAppointments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load dashboard summary" });
  }
};

// GET /api/buyer/orders/recent
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          o.order_id,
          o.order_status,
          o.total_amount,
          o.created_at,
          MIN(gi.image_url) AS image_url
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.order_id
        LEFT JOIN gem g ON g.gem_id = oi.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE o.buyer_id = ?
        GROUP BY o.order_id, o.order_status, o.total_amount, o.created_at
        ORDER BY o.created_at DESC
        LIMIT 5
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load recent orders" });
  }
};

// GET /api/buyer/wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          w.wishlist_id,
          g.gem_id,
          g.gem_name,
          g.carat,
          g.cut,
          g.price,
          MIN(gi.image_url) AS image_url
        FROM wishlist w
        JOIN gem g ON g.gem_id = w.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE w.user_id = ?
        GROUP BY w.wishlist_id, g.gem_id
        ORDER BY w.wishlist_id DESC
        LIMIT 20
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load wishlist" });
  }
};

// POST /api/buyer/wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { gem_id } = req.body;

    if (!gem_id) {
      return res.status(400).json({ error: "gem_id is required" });
    }

    await db.query(
      `
        INSERT INTO wishlist (user_id, gem_id)
        VALUES (?, ?)
      `,
      [buyerId, gem_id]
    );

    return res.status(201).json({ message: "Added to wishlist" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(200).json({ message: "Already in wishlist" });
    }
    return res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// DELETE /api/buyer/wishlist/:id
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id } = req.params;

    await db.query(
      `
        DELETE FROM wishlist
        WHERE wishlist_id = ? AND user_id = ?
      `,
      [id, buyerId]
    );

    return res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

