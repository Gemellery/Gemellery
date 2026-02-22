import { Request, Response } from "express";
import pool from "../database";
import { gemModel } from "../models/Gem.model";

export const createGem = async (req: Request, res: Response) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const seller_id = req.user.id;

        const {
            gem_name,
            gem_type,
            carat,
            cut,
            clarity,
            color,
            origin,
            price,
            description,
            ngja_certificate_no,
        } = req.body;

        const certificate =
            (req.files as any)?.certificate?.[0]?.filename || null;

        const images =
            (req.files as any)?.images?.map((f: any) => f.filename) || [];

        const [existing]: any = await conn.query(
            "SELECT gem_id FROM gem WHERE ngja_certificate_no = ? LIMIT 1",
            [ngja_certificate_no]
        );

        if (existing.length > 0) {
            await conn.rollback();
            return res.status(409).json({
                error: "This NGJA certificate number is already registered.",
            });
        }

        const [gemResult]: any = await conn.query(
            `INSERT INTO gem
            (seller_id, gem_name, gem_type, carat, cut, clarity, color, origin,
             price, description, ngja_certificate_no, ngja_certificate_url,
             updated_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Available')`,
            [
                seller_id,
                gem_name,
                gem_type || null,
                carat || null,
                cut || null,
                clarity || null,
                color || null,
                origin || null,
                price || null,
                description || null,
                ngja_certificate_no,
                certificate,
            ]
        );

        const gem_id = gemResult.insertId;

        if (images.length > 0) {
            const imageValues = images.map((filename: string) => [
                gem_id,
                filename,
            ]);

            await conn.query(
                `INSERT INTO gem_images (gem_id, image_url) VALUES ?`,
                [imageValues]
            );
        }

        await conn.commit();

        return res.status(201).json({
            message: "Gem created successfully",
            gem_id,
        });

    } catch (err: any) {
        await conn.rollback();
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "This NGJA certificate number is already used for another gem.",
            });
        }

        return res.status(500).json({
            error: "Failed to create gem",
        });

    } finally {
        conn.release(); 
    }
};

// Model method to fetch gems with filters and pagination
export const getGems = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 12;  
    
    // Calculate offset for SQL query
    const offset = (page - 1) * limit;
    
    const filters: any = {};
    
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.priceMin) {
      filters.priceMin = parseFloat(req.query.priceMin);
    }
    if (req.query.priceMax) {
      filters.priceMax = parseFloat(req.query.priceMax);
    }
    if (req.query.origin) {
      filters.origin = req.query.origin;
    }
    if (req.query.clarity) {
      filters.clarity = req.query.clarity;
    }
    if (req.query.search) {
      filters.search = req.query.search; 
    }
    if (req.query.treatment) {
      filters.treatment = req.query.treatment;
    }
    if (req.query.sellerVerification) {
      filters.sellerVerification = req.query.sellerVerification;
    }
    
    const gems = await gemModel.getGems({ ...filters, offset, limit });
    const total = await gemModel.getGemCount(filters);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: gems,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching gems:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gems",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Gem by ID (with images)
export const getGemById = async (req: any, res: any) => {
  try {
    //Extracting gem ID
    const gemId = req.params.id;
    
    //Validating the ID
    if (!gemId) {
      return res.status(400).json({
        success: false,
        message: "Gem ID is required",
      });
    }
    
    // Fetching gem details from the model
    const gem = await gemModel.getGemById(gemId);
    
    //Check if gem was found
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }
    
    //Send success response with gem details
    res.json({
      success: true,
      data: gem,
    });
  } catch (error) {
    console.error("Error fetching gem:", error);
    
    // Send error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch gem details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

