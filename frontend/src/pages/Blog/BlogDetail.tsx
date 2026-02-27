import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import type { BlogPost } from "../../types/blog.types";
import { fetchBlogById, fetchBlogs } from "../../services/blogService";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import BlogCard from "../../components/blog/BlogCard";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogById(id);
        setBlog(data.blog);
        const allData = await fetchBlogs();
        const others = allData.blogs.filter((b) => b.blog_id !== Number(id));
        setRelated(others.slice(0, 3));
      } catch (err) {
        setError("Failed to load blog post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {loading && (
        <div className="flex-1 flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading article...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 text-center py-24">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-2.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
          >
            Back to Blog
          </button>
        </div>
      )}

      {!loading && !error && blog && (
        <>
          <div className="relative w-full h-72 md:h-96 bg-gradient-to-br from-[#1a1209] to-[#2d1f0a] overflow-hidden">
            {blog.blog_image_url && (
              <img
                src={`http://localhost:5001/uploads/${blog.blog_image_url}`}
                alt={blog.blog_title}
                className="w-full h-full object-cover opacity-50"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto">
              <button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-2 text-amber-300 text-sm mb-4 hover:text-amber-200 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </button>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-full mb-4">
                <BookOpen className="w-3 h-3" /> Article
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {blog.blog_title}
              </h1>
            </div>
          </div>

          <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                <span>{blog.author_name || "Gemellery Team"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>{formatDate(blog.created_at)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {blog.blog_content.split("\n").map((para, i) =>
                para.trim() ? (
                  <p key={i} className="mb-5 text-base md:text-lg leading-relaxed text-gray-600">
                    {para}
                  </p>
                ) : (
                  <br key={i} />
                )
              )}
            </div>

            <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold shadow">
                  {(blog.author_name || "G")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-widest mb-1">Written by</p>
                  <h4 className="text-lg font-bold text-gray-900">{blog.author_name || "Gemellery Team"}</h4>
                  <p className="text-sm text-gray-500">{blog.author_email || "team@gemellery.com"}</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all articles
              </button>
            </div>
          </main>

          {related.length > 0 && (
            <section className="bg-white border-t border-gray-100 py-16">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {related.map((b) => (
                    <BlogCard key={b.blog_id} blog={b} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <AdvancedFooter />
    </div>
  );
};

export default BlogDetail;

