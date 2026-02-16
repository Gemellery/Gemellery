import { Router } from "express";
import { createGem } from "../controllers/gem.controller";
import { upload } from "../middleware/upload.middleware";
import { validateGem } from "../middleware/validateGem.middleware";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

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

export default router;
