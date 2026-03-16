import { Request, Response } from "express";
import * as BlogModel from "../models/Blog.model";

// ============================================================
// Get All Posts
// ============================================================

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        let query = `SELECT * FROM blog_posts`;
        let params: any[] = [];

        if (status && status !== "all") {
            query += ` WHERE status = ?`;
            params.push(status);
        }

        query += ` ORDER BY created_at DESC`;

        const posts = await BlogModel.getAllPosts(query, params);

        return res.json(posts);

    } catch (error) {
        console.error("Get All Blogs Error:", error);
        return res.status(500).json({
            message: "Failed to fetch blog posts",
        });
    }
};

// ============================================================
// Create Post
// ============================================================

export const createPost = async (req: Request, res: Response) => {
    try {
        const { blog_title, blog_content } = req.body;

        if (!blog_title || !blog_content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        // S3 file location
        const imageUrl = req.file
            ? (req.file as any).location
            : null;

        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const insertId = await BlogModel.createPost({
            user_id: userId,
            blog_title,
            blog_content,
            blog_image_url: imageUrl,
        });

        return res.status(201).json({
            message: "Post created successfully",
            blog_id: insertId,
        });

    } catch (error) {
        console.error("Create Blog Error:", error);
        return res.status(500).json({
            message: "Failed to create post",
        });
    }
};

// ============================================================
// Edit Post
// ============================================================

export const editPost = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { blog_title, blog_content } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Invalid blog ID",
            });
        }

        if (!blog_title || !blog_content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        const existingPost = await BlogModel.getPostById(id);

        if (!existingPost) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        let imageUrl: string | null = existingPost.blog_image_url;

        // If a new image is uploaded, replace with S3 URL
        if (req.file) {
            imageUrl = (req.file as any).location;
        }

        await BlogModel.updatePost(id, {
            user_id: existingPost.user_id,
            blog_title,
            blog_content,
            blog_image_url: imageUrl,
        });

        return res.json({
            message: "Post updated successfully",
        });

    } catch (error) {
        console.error("Edit Blog Error:", error);
        return res.status(500).json({
            message: "Failed to update post",
        });
    }
};

// ============================================================
// Delete Post
// ============================================================

export const deletePost = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({
                message: "Invalid blog ID",
            });
        }

        const existingPost = await BlogModel.getPostById(id);

        if (!existingPost) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        // Note: S3 object deletion not implemented here
        // (optional improvement later)

        await BlogModel.deletePost(id);

        return res.json({
            message: "Post deleted successfully",
        });

    } catch (error) {
        console.error("Delete Blog Error:", error);
        return res.status(500).json({
            message: "Failed to delete post",
        });
    }
};

// ============================================================
// Publish / Unpublish
// ============================================================

export const togglePublish = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!["draft", "published"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
            });
        }

        await BlogModel.updateStatus(id, status);

        return res.json({
            message: "Post status updated successfully",
        });

    } catch (error) {
        console.error("Status Update Error:", error);
        return res.status(500).json({
            message: "Failed to update status",
        });
    }
};