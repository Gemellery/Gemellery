import { Request, Response } from "express";
import pool from "../database";
import { gemModel } from "../models/gem.model";

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

// Get all gems with pagination and filters
export const getAllGems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type: req.query.type as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      color: req.query.color as string,
      origin: req.query.origin as string,
    };

    const gems = await gemModel.getGems(limit, offset, filters);
    const totalCount = await gemModel.getGemCount(filters);

    return res.status(200).json({
      success: true,
      data: gems,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch gems" });
  }
};

// Get gem details by ID
export const getGemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gem = await gemModel.getGemById(parseInt(id));

    if (!gem) {
      return res.status(404).json({ success: false, message: 'Gem not found' });
    }

    res.json({ success: true, data: gem });
  } catch (error) {
    console.error('Error fetching gem:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gem' });
  }
};

// Get gems by seller ID with pagination
export const getGemsBySeller = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const gems = await gemModel.getGemsBySeller(parseInt(sellerId), limit, offset);
    res.json({ success: true, data: gems });
  } catch (error) {
    console.error('Error fetching seller gems:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch seller gems' });
  }
};

// Search gems by name, description, or origin
export const searchGems = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const gems = await gemModel.searchGems(q as string, limit, offset);
    res.json({ success: true, data: gems });
  } catch (error) {
    console.error('Error searching gems:', error);
    res.status(500).json({ success: false, message: 'Failed to search gems' });
  }
};

// Filter gems by type, price range, color, and origin
export const filterGems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      type: req.query.type as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      color: req.query.color as string,
      origin: req.query.origin as string,
    };

    const gems = await gemModel.getGems(limit, offset, filters);
    const totalCount = await gemModel.getGemCount(filters);

    res.json({
      success: true,
      data: gems,
      totalCount,
    });
  } catch (error) {
    console.error('Error filtering gems:', error);
    res.status(500).json({ success: false, message: 'Failed to filter gems' });
  }
};

