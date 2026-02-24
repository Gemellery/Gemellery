import { Request, Response } from "express";
import db from "../database";

/**
 * GET All seller reviews
 * Includes:
 * - Seller business info
 * - Seller user account info
 * - Buyer info
 * - Optional rating filter
 */
export const getAllSellerReviews = async (req: Request, res: Response) => {
    try {
        const { rating } = req.query;

        let query = `
            SELECT 
                sr.review_id,
                sr.rating,
                sr.review,
                sr.review_date,

                s.seller_id,
                s.business_name,
                s.verification_status,

                su.user_id AS seller_user_id,
                su.email AS seller_email,
                su.full_name AS seller_full_name,

                b.user_id AS buyer_id,
                b.full_name AS buyer_name,
                b.email AS buyer_email

            FROM seller_reviews sr

            INNER JOIN seller s 
                ON sr.seller_id = s.seller_id

            INNER JOIN user su 
                ON su.user_id = s.seller_id 
                AND su.role = 'Seller'

            INNER JOIN user b 
                ON sr.buyer_id = b.user_id`;

        const values: any[] = [];

        if (rating) {
            query += " WHERE sr.rating = ?";
            values.push(rating);
        }

        query += " ORDER BY sr.review_date DESC";

        const [rows]: any = await db.query(query, values);

        res.json(rows);

    } catch (error) {
        console.error("GET REVIEWS ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};


/**
 * Delete a review
 */
export const deleteSellerReview = async (req: Request, res: Response) => {
    try {
        const { review_id } = req.params;

        if (!review_id) {
            return res.status(400).json({
                success: false,
                message: "Review ID is required"
            });
        }

        const [result]: any = await db.query(
            "DELETE FROM seller_reviews WHERE review_id = ?",
            [review_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("DELETE REVIEW ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete review"
        });
    }
};