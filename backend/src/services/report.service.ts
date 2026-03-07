import db from "../database";
import { RowDataPacket } from "mysql2";

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