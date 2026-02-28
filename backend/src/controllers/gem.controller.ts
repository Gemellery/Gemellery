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

// Fetch gems with filters and pagination
export const getGems = async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // Only show available gems
    whereConditions.push("g.status = ?");
    queryParams.push("Available");

    // Multiple value filters (gem type, color, cut, clarity, origin)
    const addInClause = (queryParam: string | undefined, column: string) => {
      if (!queryParam) return;
      const values = (queryParam as string).split(',').map(v => v.trim()).filter(v => v);
      if (values.length === 1) {
        whereConditions.push(`${column} = ?`);
        queryParams.push(values[0]);
      } else if (values.length > 1) {
        const placeholders = values.map(() => '?').join(', ');
        whereConditions.push(`${column} IN (${placeholders})`);
        queryParams.push(...values);
      }
    };

    // Filter by gem type
    addInClause(req.query.gemType, 'g.gem_type');

    // Filter by gem name 
    addInClause(req.query.gemName, 'g.gem_name');

    // Filter by color 
    addInClause(req.query.color, 'g.color');

    // Filter by cut 
    addInClause(req.query.cut, 'g.cut');

    // Filter by clarity
    addInClause(req.query.clarity, 'g.clarity');

    // Filter by origin 
    addInClause(req.query.origin, 'g.origin');

    // Filter by price range
    if (req.query.priceRanges) {
      const ranges = (req.query.priceRanges as string).split(',').map(r => r.trim()).filter(r => r);
      if (ranges.length > 0) {
        const priceConditions: string[] = [];
        ranges.forEach(range => {
          const [min, max] = range.split('-');
          if (max === 'Infinity') {
            priceConditions.push('g.price >= ?');
            queryParams.push(parseFloat(min));
          } else {
            priceConditions.push('(g.price >= ? AND g.price <= ?)');
            queryParams.push(parseFloat(min), parseFloat(max));
          }
        });
        whereConditions.push(`(${priceConditions.join(' OR ')})`);
      }
    }

    // Legacy single price min/max (keep for backward compatibility)
    if (!req.query.priceRanges) {
      if (req.query.priceMin !== undefined && !isNaN(parseFloat(req.query.priceMin))) {
        whereConditions.push("g.price >= ?");
        queryParams.push(parseFloat(req.query.priceMin));
      }
      if (req.query.priceMax !== undefined && !isNaN(parseFloat(req.query.priceMax))) {
        whereConditions.push("g.price <= ?");
        queryParams.push(parseFloat(req.query.priceMax));
      }
    }

    // Filter by certification status
    if (req.query.isCertified === "true") {
      whereConditions.push("g.ngja_certificate_url IS NOT NULL");
    } else if (req.query.isCertified === "false") {
      whereConditions.push("g.ngja_certificate_url IS NULL");
    }

    // Filter by search (text search across name, type, origin)
    if (req.query.search) {
      whereConditions.push("(g.gem_name LIKE ? OR g.gem_type LIKE ? OR g.origin LIKE ?)");
      queryParams.push(`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`);
    }

    // Filter by carat range
    if (req.query.caratMin) {
      whereConditions.push("g.carat >= ?");
      queryParams.push(parseFloat(req.query.caratMin));
    }
    if (req.query.caratMax) {
      whereConditions.push("g.carat <= ?");
      queryParams.push(parseFloat(req.query.caratMax));
    }

    // Combine all WHERE conditions with AND
    let whereClause = whereConditions.join(" AND ");

    // Build main query
    let query = `
      SELECT 
        g.gem_id as id,
        g.gem_name as name,
        g.gem_type as type,
        g.price,
        g.carat as weight,
        g.cut,
        g.clarity,
        g.color,
        g.origin,
        g.description,
        g.ngja_certificate_no as certification,
        g.ngja_certificate_url as certificateUrl,
        JSON_ARRAYAGG(gi.image_url) as images,
        g.seller_id,
        u.full_name as seller_name,
        g.verification_status as verificationStatus,
        CASE 
          WHEN g.verification_status = 'verified' THEN true
          ELSE false
        END as verified,
        g.status,
        g.created_at as createdAt
      FROM gem g
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      LEFT JOIN user u ON g.seller_id = u.user_id
      WHERE ${whereClause}
      GROUP BY g.gem_id, g.gem_name, g.gem_type, g.price, g.carat, g.cut, g.clarity, g.color, g.origin, g.description, g.ngja_certificate_no, g.ngja_certificate_url, g.seller_id, u.full_name, g.verification_status, g.status, g.created_at
      ORDER BY g.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Add pagination params
    queryParams.push(limit, offset);

    // Execute query
    const [gems] = await pool.query(query, queryParams) as any;

    // Get total count without limit/offset for pagination
    const countQueryParams = queryParams.slice(0, -2);
    const countQuery = `
      SELECT COUNT(DISTINCT g.gem_id) as total
      FROM gem g
      LEFT JOIN gem_images gi ON g.gem_id = gi.gem_id
      LEFT JOIN user u ON g.seller_id = u.user_id
      WHERE ${whereClause}
    `;
    const [countResult]: any = await pool.query(countQuery, countQueryParams);
    const total = countResult[0]?.total || 0;

    // Return response with aliased field names
    return res.status(200).json({
      success: true,
      data: gems,
      pagination: {
        page,
        limit,
        total
      }
    });

  } catch (error) {
    console.error("Error fetching gems:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch gems"
    });
  }
};

// Get Gem by ID (with images)
export const getGemById = async (req: any, res: any) => {
  try {
    const gemId = req.params.id;
    
    // Validate the ID
    if (!gemId) {
      return res.status(400).json({
        success: false,
        message: "Gem ID is required",
      });
    }
    
    // Fetch gem details from the model
    const gem = await gemModel.getGemById(gemId);
    
    // Check if gem was found
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }
    
    // Send success response with gem details
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

