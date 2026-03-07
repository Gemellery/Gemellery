import { Request, Response } from "express";
import pool from "../database";

/**
 * GET ALL ORDERS
 */
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        let query = `
      SELECT 
        o.order_id,
        o.total_amount,
        o.payment_status,
        o.order_status,
        o.created_at,
        u.full_name AS buyer_name
      FROM orders o
      LEFT JOIN user u ON o.buyer_id = u.user_id
    `;

        const params: any[] = [];

        if (status) {
            query += " WHERE o.order_status = ?";
            params.push(status);
        }

        query += " ORDER BY o.created_at DESC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET ORDER DETAILS + GEM + IMAGES
 */
export const getOrderDetails = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;

        const [orderRows]: any = await pool.query(
            "SELECT * FROM orders WHERE order_id = ?",
            [orderId]
        );

        if (!orderRows.length) {
            return res.status(404).json({ message: "Order not found" });
        }

        const [items]: any = await pool.query(
            `
      SELECT 
        oi.order_item_id,
        oi.quantity,
        oi.price AS item_price,
        g.gem_id,
        g.gem_name,
        g.gem_type,
        g.price AS gem_price,
        g.carat,
        g.color,
        g.cut,
        g.clarity,
        g.origin,
        g.description,
        g.status AS gem_status
      FROM order_items oi
      LEFT JOIN gem g ON oi.gem_id = g.gem_id
      WHERE oi.order_id = ?
      `,
            [orderId]
        );

        const gemIds = items.map((i: any) => i.gem_id);

        let imagesMap: Record<number, string[]> = {};

        if (gemIds.length > 0) {
            const [images]: any = await pool.query(
                `
        SELECT gem_id, image_url
        FROM gem_images
        WHERE gem_id IN (?)
        `,
                [gemIds]
            );

            images.forEach((img: any) => {
                if (!imagesMap[img.gem_id]) {
                    imagesMap[img.gem_id] = [];
                }
                imagesMap[img.gem_id].push(img.image_url);
            });
        }

        const finalItems = items.map((item: any) => ({
            ...item,
            images: imagesMap[item.gem_id] || [],
        }));

        res.json({
            order: orderRows[0],
            items: finalItems,
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * UPDATE STATUS
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const validStatuses = [
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        await pool.query(
            "UPDATE orders SET order_status = ? WHERE order_id = ?",
            [status, orderId]
        );

        await pool.query(
            `
      INSERT INTO order_status_history (order_id, status)
      VALUES (?, ?)
      `,
            [orderId, status]
        );

        res.json({ message: "Order status updated successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET STATUS HISTORY
 */
export const getOrderStatusHistory = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;

        const [rows] = await pool.query(
            `
      SELECT status, updated_at
      FROM order_status_history
      WHERE order_id = ?
      ORDER BY updated_at DESC
      `,
            [orderId]
        );

        res.json(rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};