import db from "../database";
import { RowDataPacket } from "mysql2";

/* SALES */

export const getSalesDetails = async (
  startDate: string,
  endDate: string
) => {

  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      p.order_id,
      p.payment_date AS order_date,
      p.amount AS total,
      p.payment_method,
      s.business_name AS seller,
      g.gem_name,
      oi.quantity,
      oi.price
    FROM payment p
    LEFT JOIN orders o ON o.order_id = p.order_id
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    LEFT JOIN gem g ON g.gem_id = oi.gem_id
    LEFT JOIN seller s ON s.seller_id = g.seller_id
    WHERE p.payment_status = 'completed'
    AND DATE(p.payment_date) BETWEEN ? AND ?
    ORDER BY p.payment_date DESC
  `, [startDate, endDate]);

  return rows;
};


/* SELLER PERFORMANCE */

export const getSellerPerformance = async () => {

  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      s.seller_id,
      s.business_name,
      COUNT(o.order_id) AS total_orders,
      SUM(p.amount) AS total_revenue
    FROM seller s
    LEFT JOIN gem g ON g.seller_id = s.seller_id
    LEFT JOIN order_items oi ON oi.gem_id = g.gem_id
    LEFT JOIN orders o ON o.order_id = oi.order_id
    LEFT JOIN payment p ON p.order_id = o.order_id
    WHERE p.payment_status = 'completed'
    GROUP BY s.seller_id
    ORDER BY total_revenue DESC
  `);

  return rows;
};


/* USER ACTIVITY */

export const getUserActivity = async () => {

  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      user_id,
      full_name,
      email,
      updated_at
    FROM user
    ORDER BY updated_at DESC
  `);

  return rows;
};


/* ORDER STATUS */

export const getOrderStatus = async () => {

  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      order_status,
      COUNT(order_id) AS total_orders
    FROM orders
    GROUP BY order_status
  `);

  return rows;
};


/* SELLER RATINGS */

export const getSellerRatings = async () => {

  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT
      s.seller_id,
      s.business_name,
      AVG(r.rating) AS average_rating,
      COUNT(r.rating) AS total_reviews
    FROM seller s
    LEFT JOIN seller_reviews r ON r.seller_id = s.seller_id
    GROUP BY s.seller_id
    ORDER BY average_rating DESC
  `);

  return rows;
};