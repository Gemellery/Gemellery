import { useNavigate } from "react-router-dom";
import type { BlogPost } from "../../types/blog.types";
import { Calendar, User } from "lucide-react";

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const excerpt = blog.blog_content.length > 150
    ? blog.blog_content.substring(0, 150) + "..."
    : blog.blog_content;

  return (
    <div
      onClick={() => navigate(`/blog/${blog.blog_id}`)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
        {blog.blog_image_url ? (
          <img
            src={`http://localhost:5001/uploads/${blog.blog_image_url}`}
            alt={blog.blog_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">💎</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs px-3 py-1 rounded-full text-amber-700 font-medium shadow">
          {formatDate(blog.created_at)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 leading-snug">
          {blog.blog_title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <User className="w-3.5 h-3.5" />
            <span>{blog.author_name || "Gemellery Team"}</span>
          </div>
          <span className="text-xs font-semibold text-amber-600 group-hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;

