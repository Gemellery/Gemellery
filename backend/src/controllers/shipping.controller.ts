import { Request, Response } from "express";
import pool from "../database";

export const getShippingAddresses = async (req: any, res: Response) => {
  const user_id = req.user.id;

  try {
    const [addresses] = await pool.query(
      `SELECT address_id, first_name, last_name, street, city,
              postal_code, country, is_default, created_at, updated_at
       FROM shipping_addresses
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      addresses
    });
  } catch (err) {
    console.error("Error fetching shipping addresses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shipping addresses"
    });
  }
};

export const createShippingAddress = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const {
    first_name,
    last_name,
    street,
    city,
    postal_code,
    country,
    is_default
  } = req.body;

  if (!first_name || !last_name || !street || !city || !postal_code || !country) {
    return res.status(400).json({
      success: false,
      message: "All address fields are required"
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    if (is_default) {
      await conn.query(
        "UPDATE shipping_addresses SET is_default = FALSE WHERE user_id = ?",
        [user_id]
      );
    }

    const [result]: any = await conn.query(
      `INSERT INTO shipping_addresses
       (user_id, first_name, last_name, street, city, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        first_name,
        last_name,
        street,
        city,
        postal_code,
        country,
        is_default || false
      ]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Shipping address created successfully",
      address_id: result.insertId
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error creating shipping address:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create shipping address"
    });
  } finally {
    conn.release();
  }
};

export const updateShippingAddress = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const { address_id } = req.params;
  const {
    first_name,
    last_name,
    street,
    city,
    postal_code,
    country,
    is_default
  } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      "SELECT address_id FROM shipping_addresses WHERE address_id = ? AND user_id = ?",
      [address_id, user_id]
    );

    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Shipping address not found"
      });
    }

    if (is_default) {
      await conn.query(
        "UPDATE shipping_addresses SET is_default = FALSE WHERE user_id = ? AND address_id != ?",
        [user_id, address_id]
      );
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (first_name !== undefined) {
      updates.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (street !== undefined) {
      updates.push("street = ?");
      values.push(street);
    }
    if (city !== undefined) {
      updates.push("city = ?");
      values.push(city);
    }
    if (postal_code !== undefined) {
      updates.push("postal_code = ?");
      values.push(postal_code);
    }
    if (country !== undefined) {
      updates.push("country = ?");
      values.push(country);
    }
    if (is_default !== undefined) {
      updates.push("is_default = ?");
      values.push(is_default);
    }

    if (updates.length > 0) {
      values.push(address_id, user_id);
      await conn.query(
        `UPDATE shipping_addresses SET ${updates.join(", ")}
         WHERE address_id = ? AND user_id = ?`,
        values
      );
    }

    await conn.commit();

    res.status(200).json({
      success: true,
      message: "Shipping address updated successfully"
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error updating shipping address:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update shipping address"
    });
  } finally {
    conn.release();
  }
};

export const deleteShippingAddress = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const { address_id } = req.params;

  try {
    const [result]: any = await pool.query(
      "DELETE FROM shipping_addresses WHERE address_id = ? AND user_id = ?",
      [address_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping address deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting shipping address:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete shipping address"
    });
  }
};

export const setDefaultAddress = async (req: any, res: Response) => {
  const user_id = req.user.id;
  const { address_id } = req.params;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query(
      "SELECT address_id FROM shipping_addresses WHERE address_id = ? AND user_id = ?",
      [address_id, user_id]
    );

    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Shipping address not found"
      });
    }

    await conn.query(
      "UPDATE shipping_addresses SET is_default = FALSE WHERE user_id = ?",
      [user_id]
    );

    await conn.query(
      "UPDATE shipping_addresses SET is_default = TRUE WHERE address_id = ? AND user_id = ?",
      [address_id, user_id]
    );

    await conn.commit();

    res.status(200).json({
      success: true,
      message: "Default shipping address set successfully"
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error setting default address:", err);
    res.status(500).json({
      success: false,
      message: "Failed to set default address"
    });
  } finally {
    conn.release();
  }
};
