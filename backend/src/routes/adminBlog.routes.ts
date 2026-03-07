import express from "express";
import * as BlogController from "../controllers/adminBlog.controller";
import { upload } from "../middleware/upload.middleware";
import { authGuard, authorizeRole } from "../middleware/auth.middleware";

const router = express.Router();

// Protected admin blog routes 

router.post(
    "/",
    authGuard,
    authorizeRole("admin", "super_admin"),
    upload.single("blog_image"),
    BlogController.createPost
);

router.put(
    "/:id",
    authGuard,
    authorizeRole("admin", "super_admin"),
    upload.single("blog_image"),
    BlogController.editPost
);

router.delete(
    "/:id",
    authGuard,
    authorizeRole("admin", "super_admin"),
    BlogController.deletePost
);

router.patch(
    "/:id/status",
    authGuard,
    authorizeRole("admin", "super_admin"),
    BlogController.togglePublish
);

router.get(
    "/",
    authGuard,
    authorizeRole("admin", "super_admin"),
    BlogController.getAllPosts
);

export default router;