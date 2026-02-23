import { useEffect, useState } from "react";
import { Menu, Trash2, Star } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";

interface Review {
    review_id: number;
    rating: number;
    review: string | null;
    review_date: string;

    business_name: string;
    seller_full_name: string;
    seller_email: string;

    buyer_name: string;
    buyer_email: string;
}

function ManageSellerReviews() {
    const [isOpen, setIsOpen] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [ratingFilter, setRatingFilter] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 15;
    const token = localStorage.getItem("token");

    useEffect(() => {
        setCurrentPage(1);
        loadReviews();
    }, [ratingFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const loadReviews = async () => {
        try {
            const query =
                ratingFilter !== "all" ? `?rating=${ratingFilter}` : "";

            const res = await fetch(
                `http://localhost:5001/api/admin/reviews${query}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load reviews");
        }
    };

    const deleteReview = async (review_id: number) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            const res = await fetch(
                `http://localhost:5001/api/admin/review/${review_id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Delete failed");
                return;
            }

            toast.success("Review deleted");

            setReviews((prev) =>
                prev.filter((r) => r.review_id !== review_id)
            );
        } catch {
            toast.error("Server error");
        }
    };

    const filtered = reviews.filter((r) => {
        const searchText = search.toLowerCase();

        return (
            r.business_name?.toLowerCase().includes(searchText) ||
            r.seller_full_name?.toLowerCase().includes(searchText) ||
            r.buyer_name?.toLowerCase().includes(searchText) ||
            r.review?.toLowerCase().includes(searchText)
        );
    });

    const totalPages = Math.ceil(filtered.length / rowsPerPage);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const storedUser = localStorage.getItem("user");
    const loggedUser = storedUser ? JSON.parse(storedUser) : null;

    const adminName = loggedUser?.full_name || "Admin";
    const role = loggedUser?.role || "admin";

    const paginatedReviews = filtered.slice(
        indexOfFirstRow,
        indexOfLastRow
    );

    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={adminName}
                role={role}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="flex-1 overflow-y-auto p-6 md:ml-64">

                <div className="flex items-center gap-4 mb-6 md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Seller Reviews Management
                    </h1>
                </div>

                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Seller Reviews Management
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                    <input
                        placeholder="Search seller, buyer, or review..."
                        className="border px-4 py-2 rounded w-full md:w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="border px-4 py-2 rounded w-full md:w-auto"
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Seller</th>
                                <th className="p-4 text-left">Buyer</th>
                                <th className="p-4 text-left">Rating</th>
                                <th className="p-4 text-left">Review</th>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedReviews.map((r) => (
                                <tr
                                    key={r.review_id}
                                    onClick={() => setSelectedReview(r)}
                                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="p-4">
                                        <div className="font-medium">
                                            {r.business_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {r.seller_full_name} ({r.seller_email})
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="font-medium">
                                            {r.buyer_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {r.buyer_email}
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(r.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className="text-yellow-500 fill-yellow-500"
                                                />
                                            ))}
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({r.rating})
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 max-w-xs">
                                        {r.review
                                            ? r.review.length > 80
                                                ? r.review.substring(0, 80) + "..."
                                                : r.review
                                            : "-"}
                                    </td>

                                    <td className="p-4">
                                        {r.review_date
                                            ? new Date(r.review_date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteReview(r.review_id);
                                            }}
                                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            No reviews found
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstRow + 1} -{" "}
                            {Math.min(indexOfLastRow, filtered.length)} of{" "}
                            {filtered.length} reviews
                        </div>

                        <div className="flex gap-2 flex-wrap justify-center">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                                className={`px-3 py-1 rounded border ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            setCurrentPage(i + 1)
                                        }
                                        className={`px-3 py-1 rounded border ${currentPage === i + 1
                                            ? "bg-teal-600 text-white"
                                            : "bg-white hover:bg-gray-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            )}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                className={`px-3 py-1 rounded border ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {selectedReview && (
                    <div className="fixed inset-0 bg-gray-200/60 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">

                            <button
                                onClick={() => setSelectedReview(null)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-semibold mb-4">
                                Review Details
                            </h2>

                            <div className="space-y-4 text-sm">

                                <div>
                                    <h3 className="font-semibold">Seller</h3>
                                    <p>{selectedReview.business_name}</p>
                                    <p className="text-gray-500">
                                        {selectedReview.seller_full_name} ({selectedReview.seller_email})
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Buyer</h3>
                                    <p>{selectedReview.buyer_name}</p>
                                    <p className="text-gray-500">
                                        {selectedReview.buyer_email}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Rating</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(selectedReview.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className="text-yellow-500 fill-yellow-500"
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-500">
                                            ({selectedReview.rating})
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Review</h3>
                                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                                        {selectedReview.review || "-"}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">Date</h3>
                                    <p>
                                        {selectedReview.review_date
                                            ? new Date(
                                                selectedReview.review_date
                                            ).toLocaleDateString("en-GB")
                                            : "-"}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageSellerReviews;