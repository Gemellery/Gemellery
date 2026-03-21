import { Request, Response } from "express";
import pool from "../database";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {

        const [totalUsers]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM user"
        );

        const [totalGems]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM gem"
        );

        const [pendingVerifications]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM seller WHERE verification_status = 'pending'"
        );

        const [pendingGemApprovals]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM gem WHERE verification_status = 'pending'"
        );

        const [totalOrders]: any = await pool.query(
            "SELECT COUNT(*) AS count FROM orders"
        );

        res.json({
            totalUsers: totalUsers[0].count,
            totalGems: totalGems[0].count,
            pendingVerifications: pendingVerifications[0].count,
            pendingGemApprovals: pendingGemApprovals[0].count,
            totalOrders: totalOrders[0].count,
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Failed to load dashboard stats" });
    }
};

// Monthly Orders Overview (Chart)
export const getMonthlyOrders = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
            SELECT 
                MONTH(created_at) AS month,
                COUNT(order_id) AS orders
            FROM orders
            WHERE YEAR(created_at) = YEAR(CURDATE())
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formatted = rows.map((row: any) => ({
            month: months[row.month - 1],
            orders: row.orders
        }));

        res.json(formatted);

    } catch (error) {
        console.error("Monthly orders error:", error);
        res.status(500).json({ message: "Failed to load monthly orders" });
    }
};

// Total Revenue
export const getTotalRevenue = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
            SELECT SUM(total_amount) AS revenue
            FROM orders
            WHERE payment_status = 'Paid'
        `);

        res.json({
            revenue: rows[0].revenue || 0
        });

    } catch (error) {
        console.error("Revenue error:", error);
        res.status(500).json({ message: "Failed to load revenue" });
    }
};

// Orders Today
export const getOrdersToday = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
            SELECT COUNT(order_id) AS todayOrders
            FROM orders
            WHERE DATE(created_at) = CURDATE()
        `);

        res.json({
            todayOrders: rows[0].todayOrders
        });

    } catch (error) {
        console.error("Orders today error:", error);
        res.status(500).json({ message: "Failed to load today's orders" });
    }
};

/* Top Gem Categories */
export const getTopGemCategories = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
            SELECT 
                gem_type AS name,
                COUNT(*) AS count
            FROM gem
            WHERE gem_type IS NOT NULL
            GROUP BY gem_type
            ORDER BY count DESC
            LIMIT 5
        `);

        res.json(rows);

    } catch (error) {
        console.error("Gem category stats error:", error);
        res.status(500).json({ message: "Failed to load gem categories" });
    }
};

/* Seller Growth Monthly */
export const getSellerGrowth = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
            SELECT 
                MONTH(created_at) AS month,
                COUNT(*) AS sellers
            FROM seller
            GROUP BY MONTH(created_at)
            ORDER BY MONTH(created_at)
        `);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formatted = rows.map((row: any) => ({
            month: months[row.month - 1],
            sellers: row.sellers
        }));

        res.json(formatted);

    } catch (error) {
        console.error("Seller growth error:", error);
        res.status(500).json({ message: "Failed to load seller growth data" });
    }
};


// Recent Orders
export const getRecentOrders = async (req: Request, res: Response) => {

    try {

        const [rows]: any = await pool.query(`
            SELECT 
                order_id,
                buyer_id,
                seller_id,
                total_amount,
                order_status,
                created_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 10
        `);

        res.json(rows);

    } catch (error) {
        console.error("Recent orders error:", error);
        res.status(500).json({ message: "Failed to load recent orders" });
    }

};

// Pending Approvals
export const getPendingApprovals = async (req: Request, res: Response) => {

    try {

        const [sellerRows]: any = await pool.query(`
            SELECT COUNT(*) AS pending_sellers
            FROM seller
            WHERE verification_status = 'pending'
        `);

        const [gemRows]: any = await pool.query(`
            SELECT COUNT(*) AS pending_gems
            FROM gem
            WHERE verification_status = 'pending'
        `);

        res.json({
            pendingSellers: sellerRows[0].pending_sellers,
            pendingGems: gemRows[0].pending_gems
        });

    } catch (error) {
        console.error("Pending approvals error:", error);
        res.status(500).json({ message: "Failed to load pending approvals" });
    }

};

// Get top sellers
export const getTopSellers = async (req: Request, res: Response) => {
    try {

        const [rows]: any = await pool.query(`
      SELECT 
        s.seller_id,
        s.business_name,
        SUM(o.total_amount) AS total_sales,
        COUNT(o.order_id) AS orders
      FROM orders o
      JOIN seller s ON o.seller_id = s.seller_id
      GROUP BY s.seller_id, s.business_name
      ORDER BY total_sales DESC
      LIMIT 5
    `);

        res.json(rows);

    } catch (error) {
        console.error("Top sellers error:", error);
        res.status(500).json({ message: "Failed to fetch top sellers" });
    }
};