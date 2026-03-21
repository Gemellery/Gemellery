import { Request, Response } from "express";
import pool from "../database";

// GET /api/blogs - Get all blog posts with author name
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT bp.blog_id, bp.user_id, bp.blog_title, bp.blog_content,
              bp.blog_image_url, bp.created_at,
              u.full_name AS author_name, u.email AS author_email
       FROM blog_posts bp
       LEFT JOIN user u ON u.user_id = bp.user_id
       ORDER BY bp.created_at DESC`
    );
    res.json({ blogs: rows, total: rows.length });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
};

// GET /api/blogs/:id - Get single blog post
export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      `SELECT bp.blog_id, bp.user_id, bp.blog_title, bp.blog_content,
              bp.blog_image_url, bp.created_at,
              u.full_name AS author_name, u.email AS author_email
       FROM blog_posts bp
       LEFT JOIN user u ON u.user_id = bp.user_id
       WHERE bp.blog_id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ blog: rows[0] });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Failed to fetch blog post" });
  }
};

// POST /api/blogs - Create a new blog post
export const createBlog = async (req: Request, res: Response) => {
  const { user_id, blog_title, blog_content, blog_image_url } = req.body;
  if (!user_id || !blog_title || !blog_content) {
    return res.status(400).json({ message: "user_id, blog_title, and blog_content are required" });
  }
  try {
    const [result]: any = await pool.query(
      `INSERT INTO blog_posts (user_id, blog_title, blog_content, blog_image_url, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [user_id, blog_title, blog_content, blog_image_url || null]
    );
    res.status(201).json({ message: "Blog post created successfully", blog_id: result.insertId });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

// DELETE /api/blogs/:id - Delete a blog post
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query(
      `DELETE FROM blog_posts WHERE blog_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
};

