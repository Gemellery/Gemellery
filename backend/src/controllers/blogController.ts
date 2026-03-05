import { Request, Response } from "express";
import pool from "../database";

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        bp.blog_id,
        bp.user_id,
        bp.blog_title,
        bp.blog_content,
        bp.blog_image_url,
        bp.status,
        bp.created_at,
        bp.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) AS author_name,
        u.email AS author_email
      FROM blog_posts bp
      LEFT JOIN user u ON bp.user_id = u.user_id
      WHERE bp.status = 'published'
      ORDER BY bp.created_at DESC
    `);
    res.status(200).json({ blogs: rows });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(`
      SELECT 
        bp.blog_id,
        bp.user_id,
        bp.blog_title,
        bp.blog_content,
        bp.blog_image_url,
        bp.status,
        bp.created_at,
        bp.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) AS author_name,
        u.email AS author_email
      FROM blog_posts bp
      LEFT JOIN user u ON bp.user_id = u.user_id
      WHERE bp.blog_id = ?
    `, [id]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Blog post not found" });
      return;
    }
    res.status(200).json({ blog: rows[0] });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Failed to fetch blog post" });
  }
};

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, blog_title, blog_content, blog_image_url, status } = req.body;
    const [result]: any = await pool.query(`
      INSERT INTO blog_posts (user_id, blog_title, blog_content, blog_image_url, status)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, blog_title, blog_content, blog_image_url || null, status || 'draft']);
    res.status(201).json({ message: "Blog post created", blog_id: result.insertId });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
};