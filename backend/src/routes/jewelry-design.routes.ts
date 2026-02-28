import { Router } from "express";
import multer from "multer";
import { authGuard } from "../middleware/auth.middleware";
import {
    getUserDesigns,
    getDesignByIdController,
    generateDesign,
    saveDesign,
    refineDesign,
    deleteDesignController,
    uploadGemImage,
    getAIStatus,
} from "../controllers/jewelry-design.controller";

const router = Router();

// Configure multer for memory storage (files stored in buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
});

// Public route - Get AI status (no auth required)
router.get("/status", getAIStatus);

// DEVELOPMENT: Generate, save, refine endpoints temporarily public for testing
// TODO: Move back below authGuard for production
router.post("/generate", generateDesign);
router.put("/:id/save", saveDesign);
router.post("/:id/refine", refineDesign);

// All other routes require authentication
router.use(authGuard);

// GET /api/jewelry-design/user-designs - Get all designs for current user
router.get("/user-designs", getUserDesigns);

// GET /api/jewelry-design/:id - Get single design by ID
router.get("/:id", getDesignByIdController);

// Note: /generate moved above for dev testing

// POST /api/jewelry-design/upload-gem-image - Upload a gem image
router.post("/upload-gem-image", upload.single("image"), uploadGemImage);

// PUT /api/jewelry-design/:id/save - Save/select a design image
router.put("/:id/save", saveDesign);

// POST /api/jewelry-design/:id/refine - Refine an existing design
router.post("/:id/refine", refineDesign);

// DELETE /api/jewelry-design/:id - Delete a design
router.delete("/:id", deleteDesignController);

export default router;
