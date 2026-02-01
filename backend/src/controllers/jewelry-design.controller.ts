import { Request, Response } from "express";
import {
    createDesign,
    getDesignById,
    getUserDesigns as getUserDesignsFromDB,
    updateDesign,
    deleteDesign as deleteDesignFromDB,
    JewelryDesignInput,
    GeneratedImage,
    Refinement,
} from "../models/JewelryDesign.model";

// ============================================
// Controller Functions
// ============================================

/**
 * Get all designs for the current user
 * GET /api/jewelry-design/user-designs
 */
export const getUserDesigns = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const designs = await getUserDesignsFromDB(userId);

        res.status(200).json({ designs });
    } catch (error) {
        console.error("Error fetching user designs:", error);
        res.status(500).json({ message: "Failed to fetch designs" });
    }
};

/**
 * Get a single design by ID
 * GET /api/jewelry-design/:id
 */
export const getDesignByIdController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const design = await getDesignById(parseInt(id), userId);

        if (!design) {
            res.status(404).json({ message: "Design not found" });
            return;
        }

        res.status(200).json({ design });
    } catch (error) {
        console.error("Error fetching design:", error);
        res.status(500).json({ message: "Failed to fetch design" });
    }
};

/**
 * Generate new jewelry designs
 * POST /api/jewelry-design/generate
 * 
 * Note: Currently uses mock images. Phase 2 will integrate real AI generation.
 */
export const generateDesign = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const {
            gemType,
            gemCut,
            gemSizeMode = "simple",
            gemSizeSimple,
            gemSizeLengthMm,
            gemSizeWidthMm,
            gemSizeHeightMm,
            gemSizeCarat,
            gemColor,
            gemTransparency,
            gemImageUrl,
            designPrompt,
            materials,
        } = req.body;

        // Validation
        if (!gemType || !gemCut || !gemColor || !gemTransparency || !designPrompt) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (!materials || !materials.metals || materials.metals.length === 0) {
            res.status(400).json({ message: "At least one metal must be selected" });
            return;
        }

        // TODO: Phase 2 - Generate images with Gemini API
        // For now, create placeholder mock images
        const mockGeneratedImages: GeneratedImage[] = [
            {
                id: `mock-${Date.now()}-1`,
                url: "https://via.placeholder.com/1024x1024/D4AF37/0A1128?text=Design+1",
                thumbnailUrl:
                    "https://via.placeholder.com/300x300/D4AF37/0A1128?text=Design+1",
                generatedAt: new Date().toISOString(),
            },
            {
                id: `mock-${Date.now()}-2`,
                url: "https://via.placeholder.com/1024x1024/D4AF37/0A1128?text=Design+2",
                thumbnailUrl:
                    "https://via.placeholder.com/300x300/D4AF37/0A1128?text=Design+2",
                generatedAt: new Date().toISOString(),
            },
            {
                id: `mock-${Date.now()}-3`,
                url: "https://via.placeholder.com/1024x1024/D4AF37/0A1128?text=Design+3",
                thumbnailUrl:
                    "https://via.placeholder.com/300x300/D4AF37/0A1128?text=Design+3",
                generatedAt: new Date().toISOString(),
            },
        ];

        // Prepare design data
        const designData: JewelryDesignInput = {
            user_id: userId,
            gem_type: gemType,
            gem_cut: gemCut,
            gem_size_mode: gemSizeMode,
            gem_size_simple: gemSizeSimple,
            gem_size_length_mm: gemSizeLengthMm,
            gem_size_width_mm: gemSizeWidthMm,
            gem_size_height_mm: gemSizeHeightMm,
            gem_size_carat: gemSizeCarat,
            gem_color: gemColor,
            gem_transparency: gemTransparency,
            gem_image_url: gemImageUrl,
            design_prompt: designPrompt,
            materials: materials,
            generated_images: mockGeneratedImages,
        };

        // Create design in database
        const designId = await createDesign(designData);

        // Fetch the created design to return
        const design = await getDesignById(designId, userId);

        res.status(201).json({
            message: "Design generated successfully",
            design,
        });
    } catch (error) {
        console.error("Error generating design:", error);
        res.status(500).json({ message: "Failed to generate design" });
    }
};

/**
 * Save/update a design (select an image)
 * PUT /api/jewelry-design/:id/save
 */
export const saveDesign = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { selectedImageUrl } = req.body;

        if (!selectedImageUrl) {
            res.status(400).json({ message: "Selected image URL is required" });
            return;
        }

        // Check if design exists and belongs to user
        const existingDesign = await getDesignById(parseInt(id), userId);

        if (!existingDesign) {
            res.status(404).json({ message: "Design not found" });
            return;
        }

        // Update design
        const updated = await updateDesign(parseInt(id), userId, {
            selected_image_url: selectedImageUrl,
        });

        if (!updated) {
            res.status(500).json({ message: "Failed to save design" });
            return;
        }

        // Fetch updated design
        const design = await getDesignById(parseInt(id), userId);

        res.status(200).json({
            message: "Design saved successfully",
            design,
        });
    } catch (error) {
        console.error("Error saving design:", error);
        res.status(500).json({ message: "Failed to save design" });
    }
};

/**
 * Refine an existing design
 * POST /api/jewelry-design/:id/refine
 * 
 * Note: Currently uses mock refined image. Phase 2 will integrate real AI refinement.
 */
export const refineDesign = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { refinementPrompt, baseImageUrl, strength = 0.5 } = req.body;

        if (!refinementPrompt || !baseImageUrl) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (strength < 0 || strength > 1) {
            res
                .status(400)
                .json({ message: "Refinement strength must be between 0 and 1" });
            return;
        }

        // Check if design exists and belongs to user
        const existingDesign = await getDesignById(parseInt(id), userId);

        if (!existingDesign) {
            res.status(404).json({ message: "Design not found" });
            return;
        }

        // TODO: Phase 2 - Refine image with Gemini API
        // For now, create mock refined image
        const mockRefinedImage: Refinement = {
            id: `refined-${Date.now()}`,
            prompt: refinementPrompt,
            baseImageUrl: baseImageUrl,
            imageUrl:
                "https://via.placeholder.com/1024x1024/D4AF37/0A1128?text=Refined",
            thumbnailUrl:
                "https://via.placeholder.com/300x300/D4AF37/0A1128?text=Refined",
            strength: strength,
            refinedAt: new Date().toISOString(),
        };

        // Add to refinements array
        const refinements = existingDesign.refinements || [];
        refinements.push(mockRefinedImage);

        // Update design with new refinement
        await updateDesign(parseInt(id), userId, {
            refinements: refinements,
            selected_image_url: mockRefinedImage.imageUrl,
        });

        // Fetch updated design
        const design = await getDesignById(parseInt(id), userId);

        res.status(200).json({
            message: "Design refined successfully",
            refinement: mockRefinedImage,
            design,
        });
    } catch (error) {
        console.error("Error refining design:", error);
        res.status(500).json({ message: "Failed to refine design" });
    }
};

/**
 * Delete a design
 * DELETE /api/jewelry-design/:id
 */
export const deleteDesignController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Check if design exists and belongs to user
        const existingDesign = await getDesignById(parseInt(id), userId);

        if (!existingDesign) {
            res.status(404).json({ message: "Design not found" });
            return;
        }

        // Delete design
        const deleted = await deleteDesignFromDB(parseInt(id), userId);

        if (!deleted) {
            res.status(500).json({ message: "Failed to delete design" });
            return;
        }

        res.status(200).json({ message: "Design deleted successfully" });
    } catch (error) {
        console.error("Error deleting design:", error);
        res.status(500).json({ message: "Failed to delete design" });
    }
};
