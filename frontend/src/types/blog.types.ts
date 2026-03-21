export interface BlogPost {
  blog_id: number;
  user_id: number;
  blog_title: string;
  blog_content: string;
  blog_image_url: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
  author_name?: string;
  author_email?: string;
}

export interface BlogResponse {
  blogs: BlogPost[];
}

export interface SingleBlogResponse {
  blog: BlogPost;
}