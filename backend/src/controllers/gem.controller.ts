import { Request, Response } from "express";
import { gemModel } from "../models/Gem.model";
import type { GemQueryParams } from "../models/Gem.model";

// ============================================================
// Create a new gem
// ============================================================
export const createGem = async (req: Request, res: Response) => {
  try {
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

    // Call the model — one line!
    const gem_id = await gemModel.createGem({
      seller_id,
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
      ngja_certificate_url: certificate,
      images,
    });

    return res.status(201).json({
      message: "Gem created successfully",
      gem_id,
    });

  } catch (err: any) {
    console.error(err);

    // Handle known error codes from the model
    if (err.code === "DUPLICATE_CERTIFICATE") {
      return res.status(409).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to create gem" });
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

