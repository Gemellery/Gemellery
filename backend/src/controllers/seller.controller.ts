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
        s.verification_status,

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

/**
 * GET /api/seller/analytics
 * Returns KPI cards, sales-over-time (last 7 days), and top gems by revenue.
 */
export const getSellerAnalytics = async (req: Request, res: Response) => {
    try {
        const sellerId = (req.user as any).id;

        // ─── 1. KPI: Total Revenue (all delivered orders) ───
        const [[revenueRow]]: any = await db.query(
            `SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS total_revenue
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND o.order_status = 'Delivered'`,
            [sellerId]
        );
        const totalRevenue = Number(revenueRow.total_revenue);

        // ─── 2. KPI: Orders This Month ───
        const [[ordersThisMonthRow]]: any = await db.query(
            `SELECT COUNT(DISTINCT oi.order_id) AS orders_this_month
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND MONTH(o.created_at) = MONTH(CURDATE())
               AND YEAR(o.created_at) = YEAR(CURDATE())`,
            [sellerId]
        );
        const ordersThisMonth = Number(ordersThisMonthRow.orders_this_month);

        // ─── 3. KPI: Orders Last Month ───
        const [[ordersLastMonthRow]]: any = await db.query(
            `SELECT COUNT(DISTINCT oi.order_id) AS orders_last_month
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND MONTH(o.created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
               AND YEAR(o.created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`,
            [sellerId]
        );
        const ordersLastMonth = Number(ordersLastMonthRow.orders_last_month);

        // ─── 4. KPI: Average Order Value ───
        const [[avgRow]]: any = await db.query(
            `SELECT COALESCE(AVG(seller_total), 0) AS avg_order_value
             FROM (
               SELECT oi.order_id, SUM(oi.price * oi.quantity) AS seller_total
               FROM order_items oi
               JOIN gem g ON g.gem_id = oi.gem_id
               JOIN orders o ON o.order_id = oi.order_id
               WHERE g.seller_id = ?
                 AND o.order_status = 'Delivered'
               GROUP BY oi.order_id
             ) sub`,
            [sellerId]
        );
        const avgOrderValue = Math.round(Number(avgRow.avg_order_value));

        // ─── 5. KPI: Refund / Cancellation Rate ───
        const [[totalOrdersRow]]: any = await db.query(
            `SELECT COUNT(DISTINCT oi.order_id) AS total
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             WHERE g.seller_id = ?`,
            [sellerId]
        );
        const [[cancelledRow]]: any = await db.query(
            `SELECT COUNT(DISTINCT oi.order_id) AS cancelled
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND o.order_status = 'Cancelled'`,
            [sellerId]
        );
        const totalOrders = Number(totalOrdersRow.total);
        const cancelledOrders = Number(cancelledRow.cancelled);
        const refundRate =
            totalOrders > 0
                ? ((cancelledOrders / totalOrders) * 100).toFixed(1) + "%"
                : "0%";

        // ─── 6. Revenue last month ───
        const [[revLastMonthRow]]: any = await db.query(
            `SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS rev
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND o.order_status = 'Delivered'
               AND MONTH(o.created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
               AND YEAR(o.created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`,
            [sellerId]
        );
        const revLastMonth = Number(revLastMonthRow.rev);

        // Helper: compute trend
        const trend = (curr: number, prev: number): "up" | "down" | "neutral" => {
            if (curr > prev) return "up";
            if (curr < prev) return "down";
            return "neutral";
        };

        const kpis = [
            {
                label: "Total Revenue (LKR)",
                value: totalRevenue,
                trend: trend(totalRevenue, revLastMonth),
            },
            {
                label: "Orders This Month",
                value: ordersThisMonth,
                trend: trend(ordersThisMonth, ordersLastMonth),
            },
            {
                label: "Average Order Value (LKR)",
                value: avgOrderValue,
                trend: "neutral" as const,
            },
            {
                label: "Refund Rate",
                value: refundRate,
                trend:
                    cancelledOrders === 0
                        ? ("neutral" as const)
                        : ("down" as const),
            },
        ];

        // ─── 7. Sales Over Time – last 7 days ───
        const [salesRows]: any = await db.query(
            `SELECT
               DATE_FORMAT(o.created_at, '%a') AS day_name,
               DATE(o.created_at) AS order_date,
               COALESCE(SUM(oi.price * oi.quantity), 0) AS sales,
               COUNT(DISTINCT oi.order_id) AS orders
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
               AND o.order_status != 'Cancelled'
             GROUP BY order_date, day_name
             ORDER BY order_date ASC`,
            [sellerId]
        );

        // Fill in missing days so the chart always has 7 data points
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const salesMap = new Map<string, { sales: number; orders: number }>();
        for (const row of salesRows) {
            salesMap.set(row.order_date.toISOString().slice(0, 10), {
                sales: Number(row.sales),
                orders: Number(row.orders),
            });
        }

        const salesOverTime: { date: string; sales: number; orders: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const dayLabel = dayNames[d.getDay()];
            const entry = salesMap.get(key);
            salesOverTime.push({
                date: dayLabel,
                sales: entry ? entry.sales : 0,
                orders: entry ? entry.orders : 0,
            });
        }

        // ─── 8. Top Gems by Revenue ───
        const [topGemsRows]: any = await db.query(
            `SELECT
               g.gem_name AS name,
               COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue
             FROM order_items oi
             JOIN gem g ON g.gem_id = oi.gem_id
             JOIN orders o ON o.order_id = oi.order_id
             WHERE g.seller_id = ?
               AND o.order_status = 'Delivered'
             GROUP BY g.gem_id, g.gem_name
             ORDER BY revenue DESC
             LIMIT 5`,
            [sellerId]
        );

        const topGems = topGemsRows.map((r: any) => ({
            name: r.name,
            revenue: Number(r.revenue),
        }));

        return res.json({ kpis, salesOverTime, topGems });
    } catch (err) {
        console.error("Seller analytics error:", err);
        return res.status(500).json({ error: "Failed to load analytics" });
    }
};
