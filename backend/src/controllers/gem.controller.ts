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
    //Query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const gemType = req.query.gemType;             
    const priceMin = parseFloat(req.query.priceMin);
    const priceMax = parseFloat(req.query.priceMax);
    const origin = req.query.origin;
    const isCertified = req.query.isCertified;     
    const color = req.query.color;                  
    const clarity = req.query.clarity;              
    const cut = req.query.cut;                      

    let whereConditions = [];
    let queryParams = [];

    // Only show available gems
    whereConditions.push("g.status = ?");
    queryParams.push("Available");

    // Filter by gem type
    if (gemType) {
      whereConditions.push("gm.gem_type = ?");
      queryParams.push(gemType);
    }

    // Filter by price range
    if (!isNaN(priceMin)) {
      whereConditions.push("gm.price >= ?");
      queryParams.push(priceMin);
    }
    if (!isNaN(priceMax)) {
      whereConditions.push("gm.price <= ?");
      queryParams.push(priceMax);
    }

    // Filter by origin
    if (origin) {
      whereConditions.push("gm.origin = ?");
      queryParams.push(origin);
    }

    // Filter by certification status
    if (isCertified === "true") {
      whereConditions.push("g.ngja_certificate_url IS NOT NULL");
    } else if (isCertified === "false") {
      whereConditions.push("g.ngja_certificate_url IS NULL");
    }

    // Filter by color
    if (color) {
      whereConditions.push("g.color = ?");
      queryParams.push(color);
    }

    // Filter by clarity grade
    if (clarity) {
      whereConditions.push("g.clarity = ?");
      queryParams.push(clarity);
    }

    // Filter by cut
    if (cut) {
      whereConditions.push("g.cut = ?");
      queryParams.push(cut);
    }

    //Combine all WHERE conditions with AND
    let whereClause = whereConditions.join(" AND ");

    //Build main query to fetch gems
    const query = `
      SELECT 
        g.gem_id,
        g.gem_name,
        g.gem_type,
        g.price,
        g.carat,
        g.color,
        g.cut,
        g.clarity,
        g.origin,
        g.description,
        g.ngja_certificate_no,
        g.ngja_certificate_url,
        g.verification_status,
        g.status,
        g.created_at,
        g.seller_id,
        u.full_name as seller_name,
        u.mobile as seller_mobile,
        JSON_ARRAYAGG(gi.image_url) as images
      FROM gem g
      LEFT JOIN user u ON g.seller_id = u.user_id
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      WHERE ${whereClause}
      ORDER BY g.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Add pagination parameters
    queryParams.push(limit, offset);

    //Execute main query
    const [gems]: any = await pool.query(query, queryParams);

    //Build count query to get total gems matching filters
    const countQuery = `
      SELECT COUNT(*) as total
      FROM gem gm
      LEFT JOIN users u ON g.seller_id = u.id
      WHERE ${whereClause}
    `;

    // Execute count query with same filter params (without LIMIT/OFFSET)
    const countQueryParams = queryParams.slice(0, -2);
    const [countResult]: any = await pool.query(countQuery, countQueryParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: gems,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: total,
        itemsPerPage: limit,
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

