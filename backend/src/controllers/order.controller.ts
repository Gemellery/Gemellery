import { Request, Response } from "express";
import pool from "../database";
import { stripe } from "../config/stripe";

const STRIPE_MAX_USD_CENTS = 99_999_999;

function toStripeAmountInCents(rawTotal: number): number {
  if (!Number.isFinite(rawTotal) || rawTotal <= 0) {
    return 0;
  }

  // Some datasets may already store monetary values in cents.
  if (rawTotal * 100 > STRIPE_MAX_USD_CENTS && rawTotal <= STRIPE_MAX_USD_CENTS) {
    return Math.round(rawTotal);
  }

  return Math.round(rawTotal * 100);
}

export const createPaymentIntent = async (req: any, res: Response) => {
  const user_id = req.user.id;

  const conn = await pool.getConnection();

  try {
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

    // Calculate total in USD cents
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const amountInCents = toStripeAmountInCents(totalAmount);

    if (amountInCents < 50) {
      return res.status(400).json({ message: "Minimum payment amount is $0.50" });
    }

    if (amountInCents > STRIPE_MAX_USD_CENTS) {
      return res.status(400).json({
        message: "Order total exceeds Stripe limit. Please reduce cart total or split into multiple orders.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        user_id: String(user_id),
        cart_id: String(cart_id),
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err?.raw?.message || err?.message || "Failed to initialize payment",
    });
  } finally {
    conn.release();
  }
};

export const checkoutOrder = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const { payment_method, shipping_address_id, payment_intent_id } = req.body;

  if (!payment_method) {
    return res.status(400).json({ message: "Payment method required" });
  }

  if (!shipping_address_id) {
    return res.status(400).json({ message: "Shipping address required" });
  }

  if (!payment_intent_id) {
    return res.status(400).json({ message: "Payment intent ID required" });
  }

  const conn = await pool.getConnection();

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment has not been completed" });
    }

    if (paymentIntent.metadata?.user_id !== String(user_id)) {
      return res.status(403).json({ message: "Payment does not belong to this user" });
    }

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

    // Get cart items with seller info
    const [items]: any = await conn.query(
      `SELECT ci.gem_id, ci.quantity, g.price, g.seller_id
       FROM cart_items ci
       JOIN gem g ON ci.gem_id = g.gem_id
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get seller_id from first item (for single seller orders)
    const seller_id = items[0].seller_id;
    
    if (!seller_id) {
      return res.status(400).json({ message: "Item seller information missing" });
    }

    // Calculate total
    const total_amount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const expectedAmountInCents = toStripeAmountInCents(total_amount);

    if (paymentIntent.currency !== "usd" || paymentIntent.amount_received < expectedAmountInCents) {
      return res.status(400).json({ message: "Paid amount does not match order total" });
    }

    // Create order
    const [orderResult]: any = await conn.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, payment_method, payment_status, address_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, seller_id, total_amount, payment_method, "Paid", shipping_address_id]
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