import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
} from "../controllers/blogController";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);

export default router;