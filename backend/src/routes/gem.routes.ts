import { Router } from "express";
import { createGem, getGems, getGemById, getGemForEdit, updateGem, getGemEnums } from "../controllers/gem.controller";
import { upload } from "../middleware/upload.middleware";
import { validateGem } from "../middleware/validateGem.middleware";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

// Create new gem listing (seller only)
router.post(
    "/",
    authGuard,
    authorizeRole("seller"),
    upload.fields([
        { name: "certificate", maxCount: 1 },
        { name: "images", maxCount: 5 },
    ]),
    validateGem,
    createGem
);

// Get gem for editing (seller only, must own it)
router.get(
    "/seller/:id",
    authGuard,
    authorizeRole("seller"),
    getGemForEdit
);

// Update gem (seller only)
router.put(
    "/:id",
    authGuard,
    authorizeRole("seller"),
    upload.fields([
        { name: "certificate", maxCount: 1 },
        { name: "images", maxCount: 5 }
    ]),
    updateGem
);

router.get("/enums", getGemEnums);

// Get all gems with optional filters and pagination
router.get("/", getGems);

// Get gem by ID (with images)
router.get("/:id", getGemById);

export default router;
