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

// Complete order history with filters 
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { status, page = 1, limit = 10, sortBy = "created_at", sortOrder = "DESC" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;
    const sort = (sortBy as string) || "created_at";
    const order = ((sortOrder as string) || "DESC").toUpperCase();

    // Validate sort order
    if (!["ASC", "DESC"].includes(order)) {
      return res.status(400).json({ error: "Invalid sort order" });
    }

    // Build query
    let countQuery = "SELECT COUNT(*) AS total FROM orders WHERE buyer_id = ?";
    let dataQuery = `
      SELECT
        o.order_id,
        o.order_status,
        o.total_amount,
        o.created_at,
        o.payment_method,
        sa.address_line1,
        sa.city,
        sa.state,
        sa.zip,
        MIN(gi.image_url) AS image_url,
        COUNT(DISTINCT oi.order_item_id) AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN gem g ON g.gem_id = oi.gem_id
      LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
      LEFT JOIN shipping_addresses sa ON sa.address_id = o.shipping_address_id
      WHERE o.buyer_id = ?
    `;

    const params: any[] = [buyerId];

    // Apply status filter
    if (status && status !== "all") {
      dataQuery += " AND o.order_status = ?";
      countQuery += " AND order_status = ?";
      params.push(status);
    }

    dataQuery += `
      GROUP BY o.order_id, o.order_status, o.total_amount, o.created_at, o.payment_method,
               sa.address_line1, sa.city, sa.state, sa.zip
      ORDER BY o.${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    // Get total count
    const [[countResult]]: any = await db.query(
      countQuery,
      status && status !== "all" ? [buyerId, status] : [buyerId]
    );
    const total = countResult?.total || 0;

    // Get paginated data
    const [rows]: any = await db.query(dataQuery, [...params, limitNum, offset]);

    return res.json({
      orders: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load order history" });
  }
};

// Get complete order details with items and status history
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id } = req.params;

    // Get order details
    const [orderRows]: any = await db.query(
      `
        SELECT
          o.order_id,
          o.order_status,
          o.total_amount,
          o.created_at,
          o.payment_method,
          sa.address_line1,
          sa.address_line2,
          sa.city,
          sa.state,
          sa.zip,
          sa.country,
          sa.phone_number,
          u.full_name,
          u.email
        FROM orders o
        LEFT JOIN shipping_addresses sa ON sa.address_id = o.shipping_address_id
        LEFT JOIN user u ON u.user_id = o.buyer_id
        WHERE o.order_id = ? AND o.buyer_id = ?
      `,
      [id, buyerId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    // Get order items
    const [items]: any = await db.query(
      `
        SELECT
          oi.order_item_id,
          oi.gem_id,
          g.gem_name,
          g.carat,
          g.cut,
          g.clarity,
          g.color,
          oi.quantity,
          oi.price,
          gi.image_url
        FROM order_items oi
        JOIN gem g ON g.gem_id = oi.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE oi.order_id = ?
        GROUP BY oi.order_item_id, oi.gem_id, g.gem_name, g.carat, g.cut, g.clarity, g.color, oi.quantity, oi.price
      `,
      [id]
    );

    // Get status history
    const [statusHistory]: any = await db.query(
      `
        SELECT status, updated_at
        FROM order_status_history
        WHERE order_id = ?
        ORDER BY updated_at DESC
      `,
      [id]
    );

    return res.json({
      order: { ...order, items, statusHistory },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load order details" });
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

