import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";
import { Edit, Trash2, Power, Menu } from "lucide-react";

interface BlogPost {
    blog_id: number;
    blog_title: string;
    blog_content: string;
    blog_image_url: string | null;
    status: "draft" | "published";
    created_at: string;
}

type StatusFilter = "published" | "draft" | "all";

function ManageBlogPosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("published");
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const [form, setForm] = useState({
        blog_title: "",
        blog_content: "",
        blog_image: null as File | null,
    });

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Load posts

    useEffect(() => {
        loadPosts();
    }, [statusFilter]);

    const loadPosts = async () => {
        try {
            const res = await fetch(
                `http://localhost:5001/api/admin/blogs?status=${statusFilter}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load posts");
        }
    };

    // Creat and Edit posts

    const openCreate = () => {
        setEditingPost(null);
        setForm({
            blog_title: "",
            blog_content: "",
            blog_image: null,
        });
        setModalOpen(true);
    };

    const openEdit = (post: BlogPost) => {
        setEditingPost(post);
        setForm({
            blog_title: post.blog_title,
            blog_content: post.blog_content,
            blog_image: null,
        });
        setModalOpen(true);
    };

    const savePost = async () => {
        if (!form.blog_title || !form.blog_content) {
            toast.error("Please complete required fields");
            return;
        }

        const url = editingPost
            ? `http://localhost:5001/api/admin/blogs/${editingPost.blog_id}`
            : `http://localhost:5001/api/admin/blogs`;

        const method = editingPost ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("blog_title", form.blog_title);
        formData.append("blog_content", form.blog_content);

        if (form.blog_image) {
            formData.append("blog_image", form.blog_image);
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                toast.error("Operation failed");
                return;
            }

            toast.success(editingPost ? "Post updated" : "Post created");
            setModalOpen(false);
            loadPosts();
        } catch {
            toast.error("Server error");
        }
    };

    // Delete posts

    const deletePost = async (post: BlogPost) => {
        const confirmMessage =
            "Are you sure you want to permanently delete this blog post?\n\nThis action cannot be undone.";

        if (!window.confirm(confirmMessage)) return;

        try {
            const res = await fetch(
                `http://localhost:5001/api/admin/blogs/${post.blog_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                toast.error("Failed to delete post");
                return;
            }

            toast.success("Post deleted successfully");

            setPosts((prev) =>
                prev.filter((p) => p.blog_id !== post.blog_id)
            );

        } catch {
            toast.error("Server error while deleting");
        }
    };

    // Status

    const toggleStatus = async (post: BlogPost) => {
        const newStatus =
            post.status === "published" ? "draft" : "published";

        const confirmMessage =
            post.status === "published"
                ? "Are you sure you want to unpublish this post?"
                : "Are you sure you want to publish this post?";

        if (!window.confirm(confirmMessage)) return;

        try {
            const res = await fetch(
                `http://localhost:5001/api/admin/blogs/${post.blog_id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) {
                toast.error("Status update failed");
                return;
            }

            toast.success(
                newStatus === "published"
                    ? "Post published successfully"
                    : "Post moved to draft"
            );

            setPosts((prev) =>
                prev.map((p) =>
                    p.blog_id === post.blog_id
                        ? { ...p, status: newStatus }
                        : p
                )
            );

        } catch {
            toast.error("Server error");
        }
    };

    const filtered = posts.filter((p) =>
        p.blog_title.toLowerCase().includes(search.toLowerCase())
    );

    const badge = (status: string) =>
        status === "published"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={user.full_name || user.email}
                role={user.role}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="flex-1 overflow-y-auto p-6 md:ml-64">

                {/* Mobile Header */}
                <div className="flex items-center gap-4 mb-6 md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Blog Management
                    </h1>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Blog Management
                    </h1>

                    <button
                        onClick={openCreate}
                        className="bg-teal-600 text-white px-5 py-2 rounded shadow hover:bg-teal-700 transition"
                    >
                        + Create Post
                    </button>
                </div>

                {/* SEARCH + FILTER */}
                <div className="flex justify-between mb-6">
                    <input
                        placeholder="Search..."
                        className="border px-4 py-2 rounded w-72"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="border px-4 py-2 rounded"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="all">All</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Image</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-left">Created</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((p) => (
                                    <tr
                                        key={p.blog_id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        {/* IMAGE */}
                                        <td className="p-4">
                                            {p.blog_image_url ? (
                                                <img
                                                    src={`http://localhost:5001${p.blog_image_url}`}
                                                    alt={p.blog_title}
                                                    className="w-16 h-16 object-cover rounded-md border shadow-sm"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-xs text-gray-400 rounded-md border">
                                                    No Image
                                                </div>
                                            )}
                                        </td>

                                        {/* TITLE */}
                                        <td className="p-4 font-medium text-gray-800">
                                            {p.blog_title}
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="p-4 text-gray-600">
                                            {new Date(p.created_at).toLocaleDateString("en-GB")}
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badge(
                                                    p.status
                                                )}`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    <Edit size={14} />
                                                </button>

                                                <button
                                                    onClick={() => toggleStatus(p)}
                                                    className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                                                >
                                                    <Power size={14} />
                                                </button>

                                                <button
                                                    onClick={() => deletePost(p)}
                                                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-gray-400 text-sm"
                                    >
                                        No blog posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                        <div className="bg-white w-96 p-6 rounded-xl shadow-2xl">
                            <h2 className="text-lg font-semibold mb-4">
                                {editingPost ? "Edit Post" : "Create Post"}
                            </h2>

                            <div className="space-y-3">
                                <input
                                    placeholder="Title"
                                    className="border w-full p-2 rounded"
                                    value={form.blog_title}
                                    onChange={(e) =>
                                        setForm({ ...form, blog_title: e.target.value })
                                    }
                                />

                                <textarea
                                    placeholder="Content"
                                    rows={6}
                                    className="border w-full p-2 rounded"
                                    value={form.blog_content}
                                    onChange={(e) =>
                                        setForm({ ...form, blog_content: e.target.value })
                                    }
                                />

                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border w-full p-2 rounded"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                blog_image: e.target.files?.[0] || null,
                                            })
                                        }
                                    />

                                    <p className="text-xs text-gray-500 mt-1">
                                        Only one image can be added.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={savePost}
                                    className="px-4 py-2 bg-teal-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageBlogPosts;