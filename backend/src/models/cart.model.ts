import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface CartItem extends RowDataPacket {
  cart_item_id: number;
  cart_id: number;
  gem_id: number;
  quantity: number;
  gem_name: string;
  gem_type: string;
  price: number;
  color: string;
  origin: string;
  image_url?: string;
}

export interface Cart extends RowDataPacket {
  cart_id: number;
  user_id: number;
  items: CartItem[];
  total_price: number;
  total_items: number;
}

export const cartModel = {
  // Get or create cart for user
  async getOrCreateCart(userId: number): Promise<number> {
    // Check if cart exists
    const [cartRows] = await pool.query<RowDataPacket[]>(
      'SELECT cart_id FROM cart WHERE user_id = ?',
      [userId]
    );

    if (cartRows.length > 0) {
      return (cartRows[0] as any).cart_id;
    }

    // Create new cart
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO cart (user_id) VALUES (?)',
      [userId]
    );

    return result.insertId;
  },

  // Add item to cart
  async addToCart(userId: number, gemId: number, quantity: number): Promise<CartItem> {
    const cartId = await this.getOrCreateCart(userId);

    // Check if gem already in cart
    const [existingItems] = await pool.query<RowDataPacket[]>(
      'SELECT cart_item_id FROM cart_items WHERE cart_id = ? AND gem_id = ?',
      [cartId, gemId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const cartItemId = (existingItems[0] as any).cart_item_id;
      const newQuantity = (existingItems[0] as any).quantity + quantity;

      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?',
        [newQuantity, cartItemId]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, gem_id, quantity) VALUES (?, ?, ?)',
        [cartId, gemId, quantity]
      );
    }

    // Get and return the added item
    return this.getCartItemDetails(cartId, gemId);
  },

  // Get full cart with items
  async getCart(userId: number): Promise<Cart | null> {
    const [cartRows] = await pool.query<RowDataPacket[]>(
      'SELECT cart_id FROM cart WHERE user_id = ?',
      [userId]
    );

    if (cartRows.length === 0) {
      return null;
    }

    const cartId = (cartRows[0] as any).cart_id;

    // Get all items in cart with gem details
    const [itemRows] = await pool.query<CartItem[]>(
      `SELECT 
        ci.cart_item_id,
        ci.cart_id,
        ci.gem_id,
        ci.quantity,
        g.gem_name,
        g.gem_type,
        g.price,
        g.color,
        g.origin,
        gi.image_url
      FROM cart_items ci
      JOIN gem g ON ci.gem_id = g.gem_id
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      WHERE ci.cart_id = ?
      GROUP BY ci.cart_item_id`,
      [cartId]
    );

    // Calculate totals
    const totalItems = itemRows.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = itemRows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      cart_id: cartId,
      user_id: userId,
      items: itemRows,
      total_price: totalPrice,
      total_items: totalItems,
    } as any;
  },

  // Update item quantity
  async updateQuantity(userId: number, gemId: number, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      return this.removeFromCart(userId, gemId);
    }

    const cartId = await this.getOrCreateCart(userId);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE cart_items 
       SET quantity = ? 
       WHERE cart_id = ? AND gem_id = ?`,
      [quantity, cartId, gemId]
    );

    return result.affectedRows > 0;
  },

  // Remove item from cart
  async removeFromCart(userId: number, gemId: number): Promise<boolean> {
    const cartId = await this.getOrCreateCart(userId);

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM cart_items WHERE cart_id = ? AND gem_id = ?',
      [cartId, gemId]
    );

    return result.affectedRows > 0;
  },

  // Clear all items from cart
  async clearCart(userId: number): Promise<boolean> {
    const cartId = await this.getOrCreateCart(userId);

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    return result.affectedRows > 0;
  },

  // Helper: Get item details
  async getCartItemDetails(cartId: number, gemId: number): Promise<CartItem> {
    const [items] = await pool.query<CartItem[]>(
      `SELECT 
        ci.cart_item_id,
        ci.cart_id,
        ci.gem_id,
        ci.quantity,
        g.gem_name,
        g.gem_type,
        g.price,
        g.color,
        g.origin,
        gi.image_url
      FROM cart_items ci
      JOIN gem g ON ci.gem_id = g.gem_id
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      WHERE ci.cart_id = ? AND ci.gem_id = ?
      LIMIT 1`,
      [cartId, gemId]
    );

    return items[0];
  },
};