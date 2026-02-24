import pool from "../database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

/* =========================================================
   INTERFACE
========================================================= */

export interface BlogPost {
    blog_id?: number;
    user_id: number;
    blog_title: string;
    blog_content: string;
    blog_image_url: string | null;
    status?: "draft" | "published";
    created_at?: Date;
}

/* =========================================================
   GET ALL POSTS
========================================================= */

export const getAllPosts = async (
    query: string,
    params: any[]
) => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        query,
        params
    );

    return rows;
};

/* =========================================================
   CREATE POST
========================================================= */

export const createPost = async (post: BlogPost): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO blog_posts 
        (user_id, blog_title, blog_content, blog_image_url, status) 
        VALUES (?, ?, ?, ?, ?)`,
        [
            post.user_id,
            post.blog_title,
            post.blog_content,
            post.blog_image_url,
            post.status || "draft",
        ]
    );

    return result.insertId;
};


/* =========================================================
   GET POST BY ID (Required for edit/delete image handling)
========================================================= */

export const getPostById = async (
    id: number
): Promise<BlogPost | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM blog_posts WHERE blog_id = ?`,
        [id]
    );

    if (rows.length === 0) return null;

    return rows[0] as BlogPost;
};


/* =========================================================
   UPDATE POST
   (Image optional — only update if provided)
========================================================= */

export const updatePost = async (
    id: number,
    post: BlogPost
): Promise<void> => {

    if (post.blog_image_url !== undefined) {
        await pool.execute(
            `UPDATE blog_posts 
             SET blog_title = ?, blog_content = ?, blog_image_url = ?
             WHERE blog_id = ?`,
            [
                post.blog_title,
                post.blog_content,
                post.blog_image_url,
                id,
            ]
        );
    } else {
        await pool.execute(
            `UPDATE blog_posts 
             SET blog_title = ?, blog_content = ?
             WHERE blog_id = ?`,
            [
                post.blog_title,
                post.blog_content,
                id,
            ]
        );
    }
};


/* =========================================================
   DELETE POST
========================================================= */

export const deletePost = async (id: number): Promise<void> => {
    await pool.execute(
        `DELETE FROM blog_posts WHERE blog_id = ?`,
        [id]
    );
};


/* =========================================================
   UPDATE STATUS
========================================================= */

export const updateStatus = async (
    id: number,
    status: "draft" | "published"
): Promise<void> => {
    await pool.execute(
        `UPDATE blog_posts SET status = ? WHERE blog_id = ?`,
        [status, id]
    );
};