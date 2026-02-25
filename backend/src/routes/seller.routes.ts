import { Router, Request, Response } from "express";
import {
  getSellerProfile,
  updateSellerProfile,
  getSellerGems,
  getRecentSellerGems
} from "../controllers/seller.controller";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";
import pool from "../database";

const router = Router();

// Existing protected routes - DO NOT TOUCH THESE
router.get("/profile", authGuard, authorizeRole("seller"), getSellerProfile);
router.patch("/profile", authGuard, authorizeRole("seller"), updateSellerProfile);
router.get("/gems", authGuard, authorizeRole("seller"), getSellerGems);
router.get("/gems/recent", authGuard, authorizeRole("seller"), getRecentSellerGems);

// NEW: Public seller profile - no login required
router.get("/:id", async (req: Request, res: Response) => {
  const sellerId = req.params.id;
  try {
    // Get seller + user info
    const [sellerRows]: any = await pool.query(
      `SELECT s.seller_id, s.business_name, s.verification_status,
              u.full_name, u.email
       FROM seller s
       JOIN user u ON u.user_id = s.seller_id
       WHERE s.seller_id = ?`,
      [sellerId]
    );
    if (sellerRows.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Get gems + images
    const [gemRows]: any = await pool.query(
      `SELECT g.gem_id, g.gem_name, g.gem_type, g.price, g.description,
              g.color, g.carat, g.origin, g.status,
              MIN(gi.image_url) AS image_url
       FROM gem g
       LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
       WHERE g.seller_id = ?
       GROUP BY g.gem_id`,
      [sellerId]
    );

    // Get reviews + buyer names
    const [reviewRows]: any = await pool.query(
      `SELECT sr.review_id, sr.rating, sr.review, sr.review_date,
              u.full_name AS buyer_name
       FROM seller_reviews sr
       JOIN user u ON u.user_id = sr.buyer_id
       WHERE sr.seller_id = ?
       ORDER BY sr.review_date DESC`,
      [sellerId]
    );

    // Calculate average rating using AVG()
    const [avgResult]: any = await pool.query(
      `SELECT AVG(rating) AS average_rating, COUNT(*) AS total_reviews
       FROM seller_reviews WHERE seller_id = ?`,
      [sellerId]
    );

    const averageRating = avgResult[0].average_rating
      ? parseFloat(parseFloat(avgResult[0].average_rating).toFixed(1))
      : 0;
    const totalReviews = parseInt(avgResult[0].total_reviews) || 0;

    return res.status(200).json({
      seller: {
        id: sellerRows[0].seller_id,
        businessName: sellerRows[0].business_name,
        fullName: sellerRows[0].full_name,
        email: sellerRows[0].email,
        verificationStatus: sellerRows[0].verification_status,
      },
      gems: gemRows.map((gem: any) => ({
        id: gem.gem_id,
        name: gem.gem_name,
        type: gem.gem_type,
        price: gem.price,
        description: gem.description,
        color: gem.color,
        carat: gem.carat,
        origin: gem.origin,
        inStock: gem.status === "Available",
        imageUrl: gem.image_url ? `/uploads/${gem.image_url}` : null,
      })),
      reviews: reviewRows.map((review: any) => ({
        id: review.review_id,
        buyerName: review.buyer_name,
        rating: review.rating,
        comment: review.review,
        date: review.review_date,
      })),
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Seller profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;