import { Router } from "express";
import multer from "multer";
import { authGuard, optionalAuthGuard } from "../middleware/auth.middleware";
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

// Design routes - use optionalAuthGuard to parse JWT if present
// Controllers handle auth enforcement (return 401 if login required)
router.post("/generate", optionalAuthGuard, generateDesign);
router.put("/:id/save", optionalAuthGuard, saveDesign);
router.post("/:id/refine", optionalAuthGuard, refineDesign);
router.get("/user-designs", optionalAuthGuard, getUserDesigns);
router.get("/:id", optionalAuthGuard, getDesignByIdController);

// All other routes require authentication
router.use(authGuard);

// POST /api/jewelry-design/upload-gem-image - Upload a gem image
router.post("/upload-gem-image", upload.single("image"), uploadGemImage);

// DELETE /api/jewelry-design/:id - Delete a design
router.delete("/:id", deleteDesignController);

export default router;
