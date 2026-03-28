import { useState, useEffect } from "react";
import { Star, Menu, MessageSquare } from "lucide-react";
import BuyerSidebar from "../../components/BuyerSidebar";
import ReviewModal from "../../components/ReviewModal";
import API_CONFIG from "../../lib/api.config";
import toast from "react-hot-toast";

interface PendingReview {
  id: number; // seller_id
  fullName: string;
  businessName: string;
  latest_item_name: string;
  image_url: string;
  order_date: string;
}

interface CompletedReview {
  id: number; // review_id
  seller_id: number;
  businessName: string;
  fullName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function BuyerReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSeller, setSelectedSeller] = useState<{ id: number; name: string } | null>(null);
  const [selectedReview, setSelectedReview] = useState<CompletedReview | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [pendingRes, completedRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/api/buyer/reviews/pending`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_CONFIG.BASE_URL}/api/buyer/reviews/completed`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (pendingRes.ok) setPendingReviews(await pendingRes.json());
      if (completedRes.ok) setCompletedReviews(await completedRes.json());
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenCreateMoadal = (sellerId: number, name: string) => {
    setModalMode("create");
    setSelectedSeller({ id: sellerId, name });
    setSelectedReview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: CompletedReview) => {
    setModalMode("edit");
    setSelectedSeller({ id: review.seller_id, name: review.businessName || review.fullName });
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    const token = localStorage.getItem("token");
    try {
      if (modalMode === "create" && selectedSeller) {
        // Submit new review
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/${selectedSeller.id}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rating, comment }),
        });
        if (!res.ok) throw new Error("Failed to submit review");
        toast.success("Review submitted successfully");
      } else if (modalMode === "edit" && selectedReview) {
        // Edit existing review
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/reviews/${selectedReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rating, comment }),
        });
        if (!res.ok) throw new Error("Failed to update review");
        toast.success("Review updated successfully");
      }
      setIsModalOpen(false);
      fetchReviews(); // Refresh lists
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder-gem.png";
    if (url.startsWith("http")) return url;
    return `${API_CONFIG.BASE_URL}/uploads/${url.startsWith("/") ? url.substring(1) : url}`;
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto flex flex-col">
        {/* Header container */}
        <div className="bg-white border-b border-gray-100 px-6 py-8 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100/80 text-gray-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h3 className="font-bold text-2xl tracking-tight text-gray-900">
                Your Reviews
              </h3>
              <p className="text-gray-500 mt-1">
                Rate your experiences with sellers and manage past feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8 flex-1">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("pending")}
              className={`pb-4 px-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "pending"
                  ? "border-[#cc000b] text-[#cc000b]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              To Review
              {pendingReviews.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "pending" ? "bg-red-100 text-[#cc000b]" : "bg-gray-100 text-gray-600"}`}>
                  {pendingReviews.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-4 px-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "completed"
                  ? "border-[#cc000b] text-[#cc000b]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Your Reviews
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#cc000b] rounded-full animate-spin" />
            </div>
          ) : activeTab === "pending" ? (
            <div className="space-y-4">
              {pendingReviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">You're all caught up!</h3>
                  <p className="text-gray-500 text-sm">You have no pending reviews at the moment.</p>
                </div>
              ) : (
                pendingReviews.map((seller) => (
                  <div key={seller.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                        <img src={getImageUrl(seller.image_url)} alt={seller.latest_item_name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{seller.businessName || seller.fullName}</h4>
                        <p className="text-sm text-gray-500">
                          Last bought item: <span className="font-medium text-gray-700">{seller.latest_item_name}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Delivered on {new Date(seller.order_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenCreateMoadal(seller.id, seller.businessName || seller.fullName)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#cc000b] text-[#cc000b] font-semibold rounded-xl hover:bg-red-50 transition-colors shrink-0"
                    >
                      Review Seller
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {completedReviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews yet</h3>
                  <p className="text-gray-500 text-sm">You haven't left any reviews for your purchases.</p>
                </div>
              ) : (
                completedReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {review.businessName || review.fullName}
                      </h4>
                      <p className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating} / 5</span>
                    </div>

                    {review.comment && (
                      <p className="text-gray-600 text-sm bg-gray-50/50 p-4 rounded-xl border border-gray-50 mb-4">
                        "{review.comment}"
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleOpenEditModal(review)}
                        className="text-sm font-semibold text-[#cc000b] hover:underline"
                      >
                        Edit Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedSeller && (
        <ReviewModal
          sellerId={selectedSeller.id}
          sellerName={selectedSeller.name}
          initialRating={selectedReview?.rating || 5}
          initialComment={selectedReview?.comment || ""}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
