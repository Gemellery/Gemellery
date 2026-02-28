import { Request, Response } from "express";
import pool from "../database";

// Add to cart
export const addToCart = async (req: any, res: Response) => {
    const user_id = req.user.id;
    const { gem_id, quantity = 1 } = req.body;

    if (!gem_id) {
        return res.status(400).json({ message: "Gem ID is required" });
    }

    try {
        // Check if user already has cart
        const [cartRows]: any = await pool.query(
            "SELECT cart_id FROM cart WHERE user_id = ?",
            [user_id]
        );

        let cart_id;

        if (cartRows.length === 0) {
            const [result]: any = await pool.query(
                "INSERT INTO cart (user_id) VALUES (?)",
                [user_id]
            );
            cart_id = result.insertId;
        } else {
            cart_id = cartRows[0].cart_id;
        }

        // Check if item already exists
        const [existing]: any = await pool.query(
            "SELECT * FROM cart_items WHERE cart_id = ? AND gem_id = ?",
            [cart_id, gem_id]
        );

        if (existing.length > 0) {
            await pool.query(
                "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND gem_id = ?",
                [quantity, cart_id, gem_id]
            );
        } else {
            await pool.query(
                "INSERT INTO cart_items (cart_id, gem_id, quantity) VALUES (?, ?, ?)",
                [cart_id, gem_id, quantity]
            );
        }

        res.json({ message: "Added to cart successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add to cart" });
    }
};

//Get Cart (with Prices)

export const getCart = async (req: any, res: Response) => {
    const user_id = req.user.id;

    try {
        const [rows]: any = await pool.query(
            `SELECT 
                ci.cart_item_id,
                g.gem_id,
                g.gem_name,
                g.price,
                ci.quantity,
                (g.price * ci.quantity) AS total_price
            FROM cart c
            JOIN cart_items ci ON c.cart_id = ci.cart_id
            JOIN gem g ON ci.gem_id = g.gem_id
            WHERE c.user_id = ?`,
            [user_id]
        );

        const totalAmount = rows.reduce(
            (sum: number, item: any) => sum + item.total_price,
            0
        );

        res.json({
            items: rows,
            totalAmount,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load cart" });
    }
};

//Update Quantity

export const updateCartItem = async (req: Request, res: Response) => {
    const { cart_item_id, quantity } = req.body;

    if (!cart_item_id || quantity < 1) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        await pool.query(
            "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
            [quantity, cart_item_id]
        );

        res.json({ message: "Cart updated" });

    } catch (err) {
        res.status(500).json({ message: "Failed to update cart" });
    }
};

// Remove Item from Cart

export const removeCartItem = async (req: Request, res: Response) => {
    const { cart_item_id } = req.params;

    try {
        await pool.query(
            "DELETE FROM cart_items WHERE cart_item_id = ?",
            [cart_item_id]
        );

        res.json({ message: "Item removed" });

    } catch (err) {
        res.status(500).json({ message: "Failed to remove item" });
    }
};