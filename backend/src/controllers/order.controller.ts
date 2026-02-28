import { Request, Response } from "express";
import pool from "../database";

export const checkoutOrder = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const { payment_method, shipping_address_id } = req.body;

  if (!payment_method) {
    return res.status(400).json({ message: "Payment method required" });
  }

  if (!shipping_address_id) {
    return res.status(400).json({ message: "Shipping address required" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Verify shipping address belongs to user
    const [addressCheck]: any = await conn.query(
      "SELECT address_id FROM shipping_addresses WHERE address_id = ? AND user_id = ?",
      [shipping_address_id, user_id]
    );

    if (addressCheck.length === 0) {
      return res.status(400).json({ message: "Invalid shipping address" });
    }

    // Get cart
    const [cartRows]: any = await conn.query(
      "SELECT cart_id FROM cart WHERE user_id = ?",
      [user_id]
    );

    if (cartRows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cart_id = cartRows[0].cart_id;

    // Get cart items
    const [items]: any = await conn.query(
      `SELECT ci.gem_id, ci.quantity, g.price
       FROM cart_items ci
       JOIN gem g ON ci.gem_id = g.gem_id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const total_amount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const [orderResult]: any = await conn.query(
      `INSERT INTO orders (user_id, total_amount, payment_method, shipping_address_id)
       VALUES (?, ?, ?, ?)`,
      [user_id, total_amount, payment_method, shipping_address_id]
    );

    const order_id = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, gem_id, price, quantity)
         VALUES (?, ?, ?, ?)`,
        [order_id, item.gem_id, item.price, item.quantity]
      );
    }

    // Clear cart
    await conn.query(
      "DELETE FROM cart_items WHERE cart_id = ?",
      [cart_id]
    );

    await conn.commit();

    res.status(201).json({
      message: "Order placed successfully",
      order_id,
      total_amount
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  } finally {
    conn.release();
  }
};