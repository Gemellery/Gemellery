import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
} from "../controllers/blog.controller";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);
router.delete("/:id", deleteBlog);

export default router;