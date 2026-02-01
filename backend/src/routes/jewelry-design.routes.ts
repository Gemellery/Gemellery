import { Router } from "express";
import { authGuard } from "../middleware/auth.middleware";
import {
    getUserDesigns,
    getDesignByIdController,
    generateDesign,
    saveDesign,
    refineDesign,
    deleteDesignController,
} from "../controllers/jewelry-design.controller";

const router = Router();

// All routes require authentication
router.use(authGuard);

// GET /api/jewelry-design/user-designs - Get all designs for current user
router.get("/user-designs", getUserDesigns);

// GET /api/jewelry-design/:id - Get single design by ID
router.get("/:id", getDesignByIdController);

// POST /api/jewelry-design/generate - Generate new jewelry designs
router.post("/generate", generateDesign);

// PUT /api/jewelry-design/:id/save - Save/select a design image
router.put("/:id/save", saveDesign);

// POST /api/jewelry-design/:id/refine - Refine an existing design
router.post("/:id/refine", refineDesign);

// DELETE /api/jewelry-design/:id - Delete a design
router.delete("/:id", deleteDesignController);

export default router;
