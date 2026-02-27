export interface BlogPost {
  blog_id: number;
  user_id: number;
  blog_title: string;
  blog_content: string;
  blog_image_url: string | null;
  created_at: string;
  author_name?: string;
  author_email?: string;
}

export interface BlogListResponse {
  blogs: BlogPost[];
  total: number;
}

export interface BlogDetailResponse {
  blog: BlogPost;
}