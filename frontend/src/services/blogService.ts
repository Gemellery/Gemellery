import { BlogListResponse, BlogDetailResponse } from "../types/blog.types";

const API_BASE = "http://localhost:5001/api";

export const fetchBlogs = async (): Promise<BlogListResponse> => {
  const res = await fetch(`${API_BASE}/blogs`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export const fetchBlogById = async (id: string | number): Promise<BlogDetailResponse> => {
  const res = await fetch(`${API_BASE}/blogs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
};

