import { Request, Response } from "express";
import pool from "../database";
import { gemModel } from "../models/Gem.model";
import type { GemQueryParams } from "../models/Gem.model";

// ============================================================
// Create a new gem
// ============================================================
export const createGem = async (req: Request, res: Response) => {
  try {
    const seller_id = (req as any).user.id;

    const {
      gem_name,
      gem_type,
      carat,
      cut,
      clarity,
      color,
      origin,
      mining_region,
      price,
      description,
      ngja_certificate_no,
    } = req.body;

    const certificate =
      (req.files as any)?.certificate?.[0]?.location || null;

    const images =
      (req.files as any)?.images?.map((f: any) => f.location) || [];

    const gem_id = await gemModel.createGem({
      seller_id,
      gem_name,
      gem_type,
      carat,
      cut,
      clarity,
      color,
      origin,
      mining_region,
      price,
      description,
      ngja_certificate_no,
      ngja_certificate_url: certificate,
      images,
    });

    return res.status(201).json({
      message: "Gem created successfully",
      gem_id,
    });

  } catch (err: any) {
    console.error(err);

    if (err.code === "DUPLICATE_CERTIFICATE") {
      return res.status(409).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to create gem" });
  }
};

export const getGemEnums = async (req: Request, res: Response) => {
  try {

    const [rows]: any = await pool.query(`
      SELECT 
        COLUMN_NAME,
        COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'gem'
      AND COLUMN_NAME IN ('gem_type','cut','clarity','origin','mining_region')
    `);

    const enums: any = {};

    rows.forEach((row: any) => {

      const values = row.COLUMN_TYPE
        .replace("enum(", "")
        .replace(")", "")
        .replace(/'/g, "")
        .split(",");

      enums[row.COLUMN_NAME] = values;
    });

    res.json(enums);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load enum values" });
  }
};

// ============================================================
// Get gem for editing (seller only)
// ============================================================
/**
 * GET /api/gems/seller/:id
 * Get a gem by ID for the owning seller (includes all fields for editing).
 */
export const getGemForEdit = async (req: Request, res: Response) => {
  try {
    const gemId = req.params.id;
    const sellerId = req.user!.id;

    const [rows]: any = await pool.query(
      `SELECT g.gem_id, g.gem_name, g.gem_type, g.carat, g.cut, g.clarity,
                    g.color, g.origin, g.price, g.description,
                    g.ngja_certificate_no, g.ngja_certificate_url, g.status
             FROM gem g
             WHERE g.gem_id = ? AND g.seller_id = ?`,
      [gemId, sellerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Gem not found or you don't own it" });
    }

    const [images]: any = await pool.query(
      `SELECT image_id, image_url FROM gem_images WHERE gem_id = ?`,
      [gemId]
    );

    return res.json({ ...rows[0], images });
  } catch (err) {
    console.error("Error fetching gem for edit:", err);
    return res.status(500).json({ error: "Failed to fetch gem" });
  }
};

// ============================================================
// Update gem (seller only)
// ============================================================
/**
 * PUT /api/gems/:id
 * Update gemstone details (seller only, must own the gem).
 */
export const updateGem = async (req: Request, res: Response) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const gemId = req.params.id;
    const sellerId = req.user!.id;

    // Verify ownership
    const [existing]: any = await conn.query(
      "SELECT gem_id FROM gem WHERE gem_id = ? AND seller_id = ?",
      [gemId, sellerId]
    );

    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Gem not found or you don't own it" });
    }

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
    } = req.body;

    // Update gem details
    await conn.query(
      `UPDATE gem SET
                gem_name = ?, gem_type = ?, carat = ?, cut = ?, clarity = ?,
                color = ?, origin = ?, price = ?, description = ?,
                updated_date = CURDATE()
             WHERE gem_id = ? AND seller_id = ?`,
      [
        gem_name,
        gem_type || null,
        carat || null,
        cut || null,
        clarity || null,
        color || null,
        origin || null,
        price || null,
        description || null,
        gemId,
        sellerId,
      ]
    );

    // Handle new images if uploaded
    const newImages = (req.files as any)?.images?.map((f: any) => f.filename) || [];

    if (newImages.length > 0) {
      const imageValues = newImages.map((filename: string) => [gemId, filename]);
      await conn.query(
        `INSERT INTO gem_images (gem_id, image_url) VALUES ?`,
        [imageValues]
      );
    }

    // Handle deleted images
    const deletedImageIds = req.body.deleted_image_ids;
    if (deletedImageIds) {
      const ids = typeof deletedImageIds === "string"
        ? JSON.parse(deletedImageIds)
        : deletedImageIds;

      if (Array.isArray(ids) && ids.length > 0) {
        await conn.query(
          `DELETE FROM gem_images WHERE image_id IN (?) AND gem_id = ?`,
          [ids, gemId]
        );
      }
    }

    await conn.commit();

    return res.json({ message: "Gem updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Error updating gem:", err);
    return res.status(500).json({ error: "Failed to update gem" });
  } finally {
    conn.release();
  }
};

// ============================================================
// Fetch gems with filters and pagination
// ============================================================
export const getGems = async (req: any, res: any) => {
  try {
    // Read and parse request params
    const params: GemQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 12,
      gemType: req.query.gemType,
      gemName: req.query.gemName,
      cut: req.query.cut,
      clarity: req.query.clarity,
      origin: req.query.origin,
      miningRegion: req.query.miningRegion,
      color: req.query.color,
      specialColors: req.query.specialColors,
      priceRanges: req.query.priceRanges,
      priceMin: req.query.priceMin ? parseFloat(req.query.priceMin) : undefined,
      priceMax: req.query.priceMax ? parseFloat(req.query.priceMax) : undefined,
      caratMin: req.query.caratMin ? parseFloat(req.query.caratMin) : undefined,
      caratMax: req.query.caratMax ? parseFloat(req.query.caratMax) : undefined,
      isCertified: req.query.isCertified,
      search: req.query.search,
    };

    // Call the model
    const gems = await gemModel.getGems(params);
    const total = await gemModel.getGemCount(params);

    // Send response
    return res.status(200).json({
      success: true,
      data: gems,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
      },
    });

  } catch (error) {
    console.error("Error fetching gems:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch gems",
    });
  }
};

// ============================================================
// Get gem by ID
// ============================================================
export const getGemById = async (req: any, res: any) => {
  try {
    const gemId = req.params.id;

    // Validate input
    if (!gemId) {
      return res.status(400).json({
        success: false,
        message: "Gem ID is required",
      });
    }

    // Call the model
    const gem = await gemModel.getGemById(gemId);

    // Check result
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: "Gem not found",
      });
    }

    // Send response
    res.json({
      success: true,
      data: gem,
    });

  } catch (error) {
    console.error("Error fetching gem:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch gem details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

