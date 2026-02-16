import express from 'express';
import {
  getAllGems,
  getGemById,
  getGemsBySeller,
  searchGems,
  filterGems,
  createGem
} from '../controllers/gem.controller';
import { upload } from "../middleware/upload.middleware";
import { validateGem } from "../middleware/validateGem.middleware";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = express.Router();

// POST route for creating gem (must be before specific GET routes)
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

// Specific routes (search and filter) before dynamic :id routes
router.get('/search', searchGems);
router.get('/filter', filterGems);
router.get('/seller/:sellerId', getGemsBySeller);

// Generic routes last (most specific to least specific)
router.get('/:id', getGemById);
router.get('/', getAllGems);

export default router;
