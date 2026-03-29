import { Request, Response } from "express";
import db from "../database";
import PDFDocument from "pdfkit";
import { transferGemOwnership } from "../services/blockchain.service";

// GET /api/buyer/profile
export const getBuyerProfile = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.joined_date,

        c.country_name,

        a.address
        FROM user u
        LEFT JOIN address a ON a.user_id = u.user_id
        LEFT JOIN country c ON c.country_id = u.country_id
        WHERE u.user_id = ? AND u.role = 'Buyer'
        `,
      [buyerId]
    );

    if (!rows.length) {
      return res.status(403).json({ error: "Not a buyer" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load buyer profile" });
  }
};

// PATCH /api/buyer/profile
export const updateBuyerProfile = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { full_name, mobile, address } = req.body;

    await db.query(
      `
        UPDATE user
        SET full_name = ?, mobile = ?
        WHERE user_id = ? AND role = 'Buyer'
        `,
      [full_name, mobile, buyerId]
    );

    // Update or insert address
    const [existingAddressResult]: any = await db.query(
      `SELECT address_id FROM address WHERE user_id = ?`,
      [buyerId]
    );

    if (existingAddressResult.length > 0) {
      await db.query(
        `
          UPDATE address
          SET address = ?
          WHERE user_id = ?
          `,
        [address, buyerId]
      );
    } else {
      await db.query(
        `
          INSERT INTO address (user_id, address)
          VALUES (?, ?)
          `,
        [buyerId, address]
      );
    }

    return res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update buyer profile" });
  }
};

// GET /api/buyer/dashboard-summary
export const getBuyerDashboardSummary = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    // Active orders: Processing or Shipped
    const [[ordersRow]]: any = await db.query(
      `
        SELECT COUNT(*) AS active_orders
        FROM orders
        WHERE buyer_id = ?
          AND order_status IN ('Processing', 'Shipped')
      `,
      [buyerId]
    );

    // Saved designs
    const [[designsRow]]: any = await db.query(
      `
        SELECT COUNT(*) AS saved_designs
        FROM design
        WHERE buyer_id = ?
      `,
      [buyerId]
    );

    const upcomingAppointments = 0;

    return res.json({
      activeOrders: ordersRow?.active_orders || 0,
      savedDesigns: designsRow?.saved_designs || 0,
      upcomingAppointments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load dashboard summary" });
  }
};

// GET /api/buyer/orders/recent
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          o.order_id,
          o.order_status,
          o.total_amount,
          o.created_at,
          g.gem_name,
          MIN(gi.image_url) AS image_url
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.order_id
        LEFT JOIN gem g ON g.gem_id = oi.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE o.buyer_id = ?
        GROUP BY o.order_id, o.order_status, o.total_amount, o.created_at, g.gem_name
        ORDER BY o.created_at DESC
        LIMIT 10
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load recent orders" });
  }
};

// Complete order history with filters 
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { status, page = 1, limit = 10, sortBy = "created_at", sortOrder = "DESC" } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;
    const sort = (sortBy as string) || "created_at";
    const order = ((sortOrder as string) || "DESC").toUpperCase();

    // Validate sort order
    if (!["ASC", "DESC"].includes(order)) {
      return res.status(400).json({ error: "Invalid sort order" });
    }

    // Build query
    let countQuery = "SELECT COUNT(*) AS total FROM orders WHERE buyer_id = ?";
    let dataQuery = `
      SELECT
        o.order_id,
        o.order_status,
        o.total_amount,
        o.created_at,
        o.payment_method,
        sa.street AS address_line1,
        sa.city,
        '' AS state,
        sa.postal_code AS zip,
        sa.country AS country,
        MIN(gi.image_url) AS image_url,
        GROUP_CONCAT(DISTINCT g.gem_name SEPARATOR ', ') AS gem_name,
        COUNT(DISTINCT oi.order_item_id) AS item_count
      FROM orders o
      LEFT JOIN shipping_addresses sa ON sa.address_id = o.address_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN gem g ON g.gem_id = oi.gem_id
      LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
      WHERE o.buyer_id = ?
    `;

    const params: any[] = [buyerId];

    // Apply status filter
    if (status && status !== "all") {
      dataQuery += " AND o.order_status = ?";
      countQuery += " AND order_status = ?";
      params.push(status);
    }

    dataQuery += `
      GROUP BY o.order_id, o.order_status, o.total_amount, o.created_at, o.payment_method, sa.street, sa.city, sa.postal_code, sa.country
      ORDER BY o.${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    // Get total count
    const [[countResult]]: any = await db.query(
      countQuery,
      status && status !== "all" ? [buyerId, status] : [buyerId]
    );
    const total = countResult?.total || 0;

    // Get paginated data
    const [rows]: any = await db.query(dataQuery, [...params, limitNum, offset]);

    return res.json({
      orders: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load order history" });
  }
};

// Get complete order details with items and status history
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id } = req.params;

    // Get order details
    const [orderRows]: any = await db.query(
      `
        SELECT
          o.order_id,
          o.order_status,
          o.total_amount,
          o.created_at,
          o.payment_method,
          sa.street AS address_line1,
          NULL AS address_line2,
          sa.city,
          '' AS state,
          sa.postal_code AS zip,
          sa.country,
          u.mobile AS phone_number,
          COALESCE(NULLIF(CONCAT(sa.first_name, ' ', sa.last_name), ' '), u.full_name) AS full_name,
          u.email
        FROM orders o
        LEFT JOIN user u ON u.user_id = o.buyer_id
        LEFT JOIN shipping_addresses sa ON sa.address_id = o.address_id
        WHERE o.order_id = ? AND o.buyer_id = ?
      `,
      [id, buyerId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    // Get order items
    const [items]: any = await db.query(
      `
        SELECT
          oi.order_item_id,
          oi.gem_id,
          g.gem_name,
          g.carat,
          g.cut,
          g.clarity,
          g.color,
          oi.quantity,
          oi.price,
          gi.image_url
        FROM order_items oi
        JOIN gem g ON g.gem_id = oi.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE oi.order_id = ?
        GROUP BY oi.order_item_id, oi.gem_id, g.gem_name, g.carat, g.cut, g.clarity, g.color, oi.quantity, oi.price
      `,
      [id]
    );

    // Get status history
    const [statusHistory]: any = await db.query(
      `
        SELECT status, updated_at
        FROM order_status_history
        WHERE order_id = ?
        ORDER BY updated_at DESC
      `,
      [id]
    );

    return res.json({
      order: { ...order, items, statusHistory },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load order details" });
  }
};

// GET /api/buyer/orders/:id/receipt
export const downloadOrderReceipt = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id } = req.params;

    const [orderRows]: any = await db.query(
      `
        SELECT
          o.order_id,
          o.total_amount,
          o.payment_method,
          o.payment_status,
          o.created_at,
          sa.street AS address_line1,
          sa.city,
          sa.postal_code AS zip,
          sa.country,
          COALESCE(NULLIF(CONCAT(sa.first_name, ' ', sa.last_name), ' '), u.full_name) AS buyer_name,
          u.email
        FROM orders o
        LEFT JOIN user u ON u.user_id = o.buyer_id
        LEFT JOIN shipping_addresses sa ON sa.address_id = o.address_id
        WHERE o.order_id = ? AND o.buyer_id = ?
        LIMIT 1
      `,
      [id, buyerId]
    );

    if (!orderRows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    if (order.payment_status !== "Paid") {
      return res.status(400).json({ error: "Receipt is available only for paid orders" });
    }

    const [items]: any = await db.query(
      `
        SELECT
          g.gem_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN gem g ON g.gem_id = oi.gem_id
        WHERE oi.order_id = ?
        ORDER BY oi.order_item_id ASC
      `,
      [id]
    );

    const formatAmount = (value: number) =>
      `LKR ${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const filename = `payment_receipt_order_${order.order_id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text("Gemellery Payment Receipt", { align: "center" });
    doc.moveDown(1.2);

    doc.fontSize(12).text(`Receipt Number: RCPT-${order.order_id}`);
    doc.text(`Order ID: ${order.order_id}`);
    doc.text(`Payment Date: ${new Date(order.created_at).toLocaleString()}`);
    doc.text(`Payment Method: ${order.payment_method || "Card"}`);
    doc.text(`Payment Status: ${order.payment_status}`);
    doc.moveDown(1);

    doc.fontSize(12).text("Buyer Details", { underline: true });
    doc.moveDown(0.3);
    doc.text(`Name: ${order.buyer_name || "N/A"}`);
    doc.text(`Email: ${order.email || "N/A"}`);
    doc.text(`Address: ${order.address_line1 || ""}`);
    doc.text(`City: ${order.city || ""}`);
    doc.text(`Postal Code: ${order.zip || ""}`);
    doc.text(`Country: ${order.country || ""}`);
    doc.moveDown(1);

    doc.fontSize(12).text("Items", { underline: true });
    doc.moveDown(0.3);

    if (!items.length) {
      doc.text("No items found for this order.");
    } else {
      items.forEach((item: any, index: number) => {
        const lineTotal = Number(item.price) * Number(item.quantity);
        doc.text(
          `${index + 1}. ${item.gem_name}  |  Qty: ${item.quantity}  |  Unit: ${formatAmount(
            Number(item.price)
          )}  |  Line Total: ${formatAmount(lineTotal)}`
        );
      });
    }

    doc.moveDown(1.2);
    doc.fontSize(14).text(`Total Paid: ${formatAmount(Number(order.total_amount))}`, {
      align: "right",
    });
    doc.moveDown(1.2);
    doc.fontSize(10).fillColor("#555").text("This is a system-generated payment receipt.", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate payment receipt" });
  }
};

// GET /api/buyer/wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          w.wishlist_id,
          g.gem_id,
          g.gem_name,
          g.carat,
          g.cut,
          g.price,
          g.status,
          MIN(gi.image_url) AS image_url
        FROM wishlist w
        JOIN gem g ON g.gem_id = w.gem_id
        LEFT JOIN gem_images gi ON gi.gem_id = g.gem_id
        WHERE w.user_id = ?
        GROUP BY w.wishlist_id, g.gem_id
        ORDER BY w.wishlist_id DESC
        LIMIT 20
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load wishlist" });
  }
};

// POST /api/buyer/wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { gem_id } = req.body;

    if (!gem_id) {
      return res.status(400).json({ error: "gem_id is required" });
    }

    await db.query(
      `
        INSERT INTO wishlist (user_id, gem_id)
        VALUES (?, ?)
      `,
      [buyerId, gem_id]
    );

    return res.status(201).json({ message: "Added to wishlist" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(200).json({ message: "Already in wishlist" });
    }
    return res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// DELETE /api/buyer/wishlist/:id
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id } = req.params;

    await db.query(
      `
        DELETE FROM wishlist
        WHERE wishlist_id = ? AND user_id = ?
      `,
      [id, buyerId]
    );

    return res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

export const getPendingReviews = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          g.seller_id AS id,
          u.full_name AS fullName,
          s.business_name AS businessName,
          MAX(g.gem_name) AS latest_item_name,
          MIN(gi.image_url) AS image_url,
          MAX(o.created_at) AS order_date,
          MAX(o.order_id) AS order_id
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN gem g ON oi.gem_id = g.gem_id
        JOIN seller s ON g.seller_id = s.seller_id
        JOIN user u ON s.seller_id = u.user_id
        LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
        LEFT JOIN seller_reviews sr ON sr.buyer_id = o.buyer_id AND sr.seller_id = g.seller_id
        WHERE o.buyer_id = ?
          AND o.order_status = 'Delivered'
          AND sr.review_id IS NULL
        GROUP BY g.seller_id, u.full_name, s.business_name
        ORDER BY order_date DESC
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load pending reviews" });
  }
};

export const getCompletedReviews = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          sr.review_id AS id,
          sr.seller_id,
          s.business_name AS businessName,
          u.full_name AS fullName,
          sr.rating,
          sr.review AS comment,
          sr.review_date AS date
        FROM seller_reviews sr
        JOIN seller s ON sr.seller_id = s.seller_id
        JOIN user u ON s.seller_id = u.user_id
        WHERE sr.buyer_id = ?
        ORDER BY sr.review_date DESC
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load completed reviews" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { id: review_id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const [result]: any = await db.query(
      `
        UPDATE seller_reviews
        SET rating = ?, review = ?
        WHERE review_id = ? AND buyer_id = ?
      `,
      [rating, comment || "", review_id, buyerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Review not found or unauthorized" });
    }

    return res.json({ message: "Review updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update review" });
  }
};

// ==========================================
// BLOCKCHAIN CERTIFICATES
// ==========================================

// GET /api/buyer/certificates
export const getBuyerCertificates = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;

    const [rows]: any = await db.query(
      `
        SELECT
          g.gem_id,
          g.gem_name,
          g.gem_type,
          g.carat,
          g.cut,
          g.clarity,
          g.color,
          g.origin,
          g.price,
          g.ngja_certificate_no,
          g.token_id,
          g.tx_hash,
          g.blockchain_status,
          g.minted_at,
          g.nft_claimed,
          g.nft_owner_address,
          u.full_name as seller_name,
          s.business_name,
          o.order_id,
          o.created_at as purchased_at,
          MIN(gi.image_url) as image_url
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN gem g ON oi.gem_id = g.gem_id
        LEFT JOIN user u ON g.seller_id = u.user_id
        LEFT JOIN seller s ON g.seller_id = s.seller_id
        LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
        WHERE o.buyer_id = ?
          AND g.blockchain_status = 'minted'
          AND g.token_id IS NOT NULL
        GROUP BY g.gem_id, o.order_id, o.created_at,
                 g.gem_name, g.gem_type, g.carat, g.cut, g.clarity, g.color,
                 g.origin, g.price, g.ngja_certificate_no, g.token_id, g.tx_hash,
                 g.blockchain_status, g.minted_at, g.nft_claimed, g.nft_owner_address,
                 u.full_name, s.business_name
        ORDER BY o.created_at DESC
      `,
      [buyerId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load certificates" });
  }
};

// POST /api/buyer/certificates/claim
export const claimNFT = async (req: Request, res: Response) => {
  try {
    const buyerId = (req.user as any).id;
    const { gem_id, wallet_address } = req.body;

    if (!gem_id) {
      return res.status(400).json({ error: "gem_id is required" });
    }

    if (!wallet_address) {
      return res.status(400).json({ error: "wallet_address is required" });
    }

    // Validate Ethereum address format
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(wallet_address)) {
      return res.status(400).json({ error: "Invalid Ethereum wallet address" });
    }

    // Verify buyer owns this gem (purchased it)
    const [ownerCheck]: any = await db.query(
      `
        SELECT g.gem_id, g.token_id, g.nft_claimed, g.blockchain_status
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN gem g ON oi.gem_id = g.gem_id
        WHERE o.buyer_id = ? AND g.gem_id = ?
        LIMIT 1
      `,
      [buyerId, gem_id]
    );

    if (ownerCheck.length === 0) {
      return res.status(403).json({ error: "You do not own this gem" });
    }

    const gem = ownerCheck[0];

    if (gem.nft_claimed) {
      return res.status(400).json({ error: "NFT has already been claimed to a wallet" });
    }

    if (gem.blockchain_status !== "minted" || !gem.token_id) {
      return res.status(400).json({ error: "This gem does not have a minted NFT" });
    }

    // Transfer the NFT on the blockchain
    const result = await transferGemOwnership(gem.token_id, wallet_address);

    // Update the database to record the claim
    await db.query(
      `
        UPDATE gem
        SET nft_claimed = TRUE,
            nft_owner_address = ?,
            nft_claim_tx_hash = ?
        WHERE gem_id = ?
      `,
      [wallet_address, result.txHash, gem_id]
    );

    return res.json({
      message: "NFT transferred to your wallet successfully!",
      txHash: result.txHash,
      walletAddress: wallet_address,
    });
  } catch (err: any) {
    console.error("NFT claim failed:", err);
    return res.status(500).json({
      error: "Failed to transfer NFT to wallet",
      details: err.message,
    });
  }
};

