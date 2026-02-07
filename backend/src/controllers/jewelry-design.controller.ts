import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
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
import {
    buildJewelryPrompt,
    generateJewelryDesigns,
    refineJewelryDesign,
    isGeminiConfigured,
    DesignPromptInput,
} from "../utils/gemini";
import {
    uploadDesignImage,
    uploadGemImage as uploadGemImageToStorage,
    isFirebaseConfigured,
    getPlaceholderImageUrl,
    getPlaceholderThumbnailUrl,
    processUploadedImage,
} from "../utils/firebase-storage";

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
 * Integrates with Gemini AI for design generation and Firebase for storage.
 * Falls back to placeholder images if AI is not available.
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
            numImages = 3,
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

        console.log(`[Design] Generating ${numImages} designs for user ${userId}...`);

        // Build prompt input for Gemini
        const promptInput: DesignPromptInput = {
            gemProperties: {
                gemType,
                gemCut,
                gemSizeMode,
                gemSizeSimple,
                gemSizeLengthMm,
                gemSizeWidthMm,
                gemSizeHeightMm,
                gemSizeCarat,
                gemColor,
                gemTransparency,
                gemImageUrl,
            },
            designPrompt,
            materials,
        };

        let generatedImages: GeneratedImage[] = [];

        // Check if Gemini and Firebase are configured
        const aiConfigured = isGeminiConfigured() && isFirebaseConfigured();

        if (aiConfigured) {
            console.log("[Design] Using AI generation...");

            try {
                // Generate designs using Gemini
                const aiDesigns = await generateJewelryDesigns(promptInput, numImages);

                // For now, Gemini 2.0 Flash doesn't directly generate images
                // We'll use placeholder images until we integrate Imagen or another image model
                // But we've validated the prompts work

                for (let i = 0; i < numImages; i++) {
                    const imageId = uuidv4();
                    generatedImages.push({
                        id: imageId,
                        url: getPlaceholderImageUrl(`Design ${i + 1}`),
                        thumbnailUrl: getPlaceholderThumbnailUrl(`Design ${i + 1}`),
                        generatedAt: new Date().toISOString(),
                    });
                }

                console.log(`[Design] Generated ${generatedImages.length} AI-prompted designs`);
            } catch (aiError) {
                console.error("[Design] AI generation failed, using placeholders:", aiError);
                // Fall back to placeholders
                for (let i = 0; i < numImages; i++) {
                    generatedImages.push({
                        id: `fallback-${Date.now()}-${i}`,
                        url: getPlaceholderImageUrl(`Design ${i + 1}`),
                        thumbnailUrl: getPlaceholderThumbnailUrl(`Design ${i + 1}`),
                        generatedAt: new Date().toISOString(),
                    });
                }
            }
        } else {
            console.log("[Design] AI not configured, using placeholder images...");
            // Use placeholder images when AI is not configured
            for (let i = 0; i < numImages; i++) {
                generatedImages.push({
                    id: `placeholder-${Date.now()}-${i}`,
                    url: getPlaceholderImageUrl(`Design ${i + 1}`),
                    thumbnailUrl: getPlaceholderThumbnailUrl(`Design ${i + 1}`),
                    generatedAt: new Date().toISOString(),
                });
            }
        }

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
            generated_images: generatedImages,
        };

        // Create design in database
        const designId = await createDesign(designData);

        // Fetch the created design to return
        const design = await getDesignById(designId, userId);

        res.status(201).json({
            message: "Design generated successfully",
            design,
            aiUsed: aiConfigured,
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
 * Uses Gemini AI for design refinement with fallback to placeholders.
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

        console.log(`[Refine] Refining design ${id} for user ${userId}...`);

        let refinedImageUrl = "";
        let refinedThumbnailUrl = "";
        const refinementId = uuidv4();

        // Check if AI is configured
        const aiConfigured = isGeminiConfigured() && isFirebaseConfigured();

        if (aiConfigured) {
            try {
                // Attempt AI refinement
                const refined = await refineJewelryDesign(
                    existingDesign.design_prompt,
                    refinementPrompt,
                    undefined, // We could pass base64 image here
                    strength
                );

                if (refined) {
                    // For now, use placeholders since image generation isn't working yet
                    refinedImageUrl = getPlaceholderImageUrl("Refined");
                    refinedThumbnailUrl = getPlaceholderThumbnailUrl("Refined");
                }
            } catch (aiError) {
                console.error("[Refine] AI refinement failed:", aiError);
            }
        }

        // Fallback to placeholder
        if (!refinedImageUrl) {
            refinedImageUrl = getPlaceholderImageUrl("Refined");
            refinedThumbnailUrl = getPlaceholderThumbnailUrl("Refined");
        }

        const refinement: Refinement = {
            id: refinementId,
            prompt: refinementPrompt,
            baseImageUrl: baseImageUrl,
            imageUrl: refinedImageUrl,
            thumbnailUrl: refinedThumbnailUrl,
            strength: strength,
            refinedAt: new Date().toISOString(),
        };

        // Add to refinements array
        const refinements = existingDesign.refinements || [];
        refinements.push(refinement);

        // Update design with new refinement
        await updateDesign(parseInt(id), userId, {
            refinements: refinements,
            selected_image_url: refinement.imageUrl,
        });

        // Fetch updated design
        const design = await getDesignById(parseInt(id), userId);

        res.status(200).json({
            message: "Design refined successfully",
            refinement,
            design,
            aiUsed: aiConfigured,
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

/**
 * Upload a gem image
 * POST /api/jewelry-design/upload-gem-image
 * 
 * Accepts multipart/form-data with an image file.
 */
export const uploadGemImage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Check if file was uploaded (multer puts it on req.file)
        const file = (req as any).file;

        if (!file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }

        console.log(`[Upload] Processing gem image for user ${userId}...`);

        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
            res.status(503).json({
                message: "Image upload service not configured",
                error: "Firebase Storage is not configured. Please set up Firebase credentials."
            });
            return;
        }

        try {
            // Process and optimize the image
            const processedBuffer = await processUploadedImage(file.buffer);

            // Upload to Firebase Storage
            const uploadResult = await uploadGemImageToStorage(processedBuffer, userId);

            res.status(200).json({
                message: "Gem image uploaded successfully",
                imageUrl: uploadResult.url,
                thumbnailUrl: uploadResult.thumbnailUrl,
                imageId: uploadResult.id,
            });
        } catch (uploadError: any) {
            console.error("[Upload] Error processing/uploading image:", uploadError);
            res.status(500).json({
                message: "Failed to upload image",
                error: uploadError.message
            });
        }
    } catch (error) {
        console.error("Error uploading gem image:", error);
        res.status(500).json({ message: "Failed to upload gem image" });
    }
};

/**
 * Get AI configuration status
 * GET /api/jewelry-design/status
 */
export const getAIStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.status(200).json({
        geminiConfigured: isGeminiConfigured(),
        firebaseConfigured: isFirebaseConfigured(),
        aiAvailable: isGeminiConfigured() && isFirebaseConfigured(),
    });
};
