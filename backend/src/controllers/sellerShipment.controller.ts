import { Request, Response } from "express";
import db from "../database";

// List all orders for this seller with shipment info
export const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user!.id;

        const [rows]: any = await db.query(
            `SELECT DISTINCT
                o.order_id,
                o.order_status,
                o.payment_status,
                o.total_amount,
                o.created_at,
                u.full_name AS buyer_name,
                u.email AS buyer_email,
                sa.first_name AS ship_first_name,
                sa.last_name AS ship_last_name,
                sa.street AS ship_street,
                sa.city AS ship_city,
                sa.country AS ship_country,
                sa.postal_code AS ship_postal_code,
                s.shipment_id,
                s.tracking_no,
                s.carrier,
                s.shipment_status,
                s.shipped_date,
                s.delivered_date
             FROM orders o
             JOIN order_items oi ON oi.order_id = o.order_id
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN user u ON u.user_id = o.buyer_id
             LEFT JOIN shipping_addresses sa ON sa.address_id = o.shipping_address_id
             LEFT JOIN shipment s ON s.order_id = o.order_id
             WHERE g.seller_id = ?
             ORDER BY o.created_at DESC`,
            [sellerId]
        );

        // Deduplicate orders (an order with multiple items may appear multiple times)
        const seen = new Set<number>();
        const uniqueRows = rows.filter((r: any) => {
            if (seen.has(r.order_id)) return false;
            seen.add(r.order_id);
            return true;
        });

        // Fetch order items for each order
        const orderIds = uniqueRows.map((r: any) => r.order_id);
        let itemsMap: Record<number, any[]> = {};

        if (orderIds.length > 0) {
            const [items]: any = await db.query(
                `SELECT oi.order_id, oi.order_item_id, oi.quantity, oi.price,
                        g.gem_name, g.gem_type, g.color,
                        MIN(gi.image_url) AS image_url
                 FROM order_items oi
                 JOIN gem g ON g.gem_id = oi.gem_id
                 LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
                 WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})
                 GROUP BY oi.order_item_id`,
                orderIds
            );
            for (const item of items) {
                if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
                itemsMap[item.order_id].push(item);
            }
        }

        const orders = uniqueRows.map((row: any) => ({
            ...row,
            items: itemsMap[row.order_id] || [],
        }));

        return res.json({ success: true, data: orders });
    } catch (err) {
        console.error("getSellerOrders error:", err);
        return res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
};

// Create or update shipment for an order
export const upsertShipment = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user!.id;
        const orderId = Number(req.params.orderId);
        const { tracking_no, carrier } = req.body;

        if (!tracking_no) {
            return res.status(400).json({ success: false, error: "Tracking number is required" });
        }

        // Verify this order belongs to the seller
        const [ownerCheck]: any = await db.query(
            `SELECT 1 FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             WHERE oi.order_id = ? AND g.seller_id = ?
             LIMIT 1`,
            [orderId, sellerId]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({ success: false, error: "Order not found or not yours" });
        }

        // Check if shipment already exists
        const [existing]: any = await db.query(
            `SELECT shipment_id FROM shipment WHERE order_id = ?`,
            [orderId]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE shipment SET tracking_no = ?, carrier = ? WHERE order_id = ?`,
                [tracking_no, carrier || null, orderId]
            );
        } else {
            await db.query(
                `INSERT INTO shipment (order_id, tracking_no, carrier, shipment_status, shipped_date)
                 VALUES (?, ?, ?, 'pending', NOW())`,
                [orderId, tracking_no, carrier || null]
            );
        }

        // Update order status to Shipped
        await db.query(
            `UPDATE orders SET order_status = 'Shipped' WHERE order_id = ? AND order_status = 'Processing'`,
            [orderId]
        );

        return res.json({ success: true, message: "Shipment updated" });
    } catch (err) {
        console.error("upsertShipment error:", err);
        return res.status(500).json({ success: false, error: "Failed to update shipment" });
    }
};

// Update shipment status
export const updateShipmentStatus = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user!.id;
        const orderId = Number(req.params.orderId);
        const { status } = req.body;

        const validStatuses = ["pending", "completed", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        // Verify ownership
        const [ownerCheck]: any = await db.query(
            `SELECT 1 FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             WHERE oi.order_id = ? AND g.seller_id = ?
             LIMIT 1`,
            [orderId, sellerId]
        );

        if (ownerCheck.length === 0) {
            return res.status(403).json({ success: false, error: "Order not found or not yours" });
        }

        const deliveredDate = status === "delivered" ? "NOW()" : "NULL";
        await db.query(
            `UPDATE shipment
             SET shipment_status = ?,
                 delivered_date = ${deliveredDate}
             WHERE order_id = ?`,
            [status, orderId]
        );

        // Sync order status
        if (status === "delivered") {
            await db.query(
                `UPDATE orders SET order_status = 'Delivered' WHERE order_id = ?`,
                [orderId]
            );
        }

        return res.json({ success: true, message: "Shipment status updated" });
    } catch (err) {
        console.error("updateShipmentStatus error:", err);
        return res.status(500).json({ success: false, error: "Failed to update status" });
    }
};
