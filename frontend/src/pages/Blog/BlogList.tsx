import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AdvancedFooter from "../../components/AdvancedFooter";
import BlogCard from "../../components/blog/BlogCard";
import type { BlogPost } from "../../types/blog.types";
import { fetchBlogs } from "../../services/blogService";
import { Search, BookOpen } from "lucide-react";

const FeaturedBlog: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div
      onClick={() => navigate(`/blog/${blog.blog_id}`)}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row"
    >
      <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 min-h-64">
        {blog.blog_image_url ? (
          <img
            src={`http://localhost:5001/uploads/${blog.blog_image_url}`}
            alt={blog.blog_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl opacity-10">💎</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
          Featured
        </div>
      </div>
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-3">
          {formatDate(blog.created_at)}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-amber-700 transition-colors leading-tight">
          {blog.blog_title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-4">
          {blog.blog_content}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">By {blog.author_name || "Gemellery Team"}</span>
          <span className="text-sm font-semibold text-amber-600 group-hover:underline">Read Full Article →</span>
        </div>
      </div>
    </div>
  );
};

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogs();
        setBlogs(data.blogs);
        setFiltered(data.blogs);
      } catch (err) {
        setError("Failed to load blog posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(blogs);
    } else {
      const q = search.toLowerCase();
      setFiltered(blogs.filter(b =>
        b.blog_title.toLowerCase().includes(q) ||
        b.blog_content.toLowerCase().includes(q) ||
        (b.author_name && b.author_name.toLowerCase().includes(q))
      ));
    }
  }, [search, blogs]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />
      <section className="bg-gradient-to-br from-[#1a1209] via-[#2d1f0a] to-[#1a1209] text-white px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-amber-600 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5" /> Events & News
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Gemellery <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Blog</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
            Stories, events and news from the heart of Sri Lanka's gemstone world.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-sm"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-16">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading articles...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-24">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition">
              Try Again
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-400 text-sm">{search ? "Try a different search term." : "Check back soon for new content!"}</p>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <p className="text-gray-400 text-sm mt-1">{filtered.length} article{filtered.length !== 1 ? "s" : ""} found</p>
              </div>
            </div>
            {!search && filtered.length > 0 && (
              <div className="mb-12"><FeaturedBlog blog={filtered[0]} /></div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(search ? filtered : filtered.slice(1)).map((blog) => (
                <BlogCard key={blog.blog_id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </main>
      <AdvancedFooter />
    </div>
  );
};

export default BlogList;

