import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import { Heart, Menu, Trash2 } from "lucide-react";
import type { WishlistItem } from "../../lib/wishlist/types";
import { getGemImageUrl } from "../../lib/gems/api";
import { removeFromWishlist, clearWishlist } from "../../lib/wishlist/api";

function WishlistPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/wishlist`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        // Debug: log image URLs for each item
        (data.items || data).forEach((item: any) => {
          console.log('Wishlist image_url:', item.image_url, 'gem_id:', item.gem_id, 'gem_name:', item.gem_name);
        });
        setWishlist(data.items || data); // support both array and {items: array}
      } catch (err) {
        console.error("wishlist error", err);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (e: React.MouseEvent, gemId: number) => {
    e.stopPropagation();
    try {
      await removeFromWishlist(gemId);
      setWishlist((prev) => prev.filter((item) => item.gem_id !== gemId));
    } catch (err) {
      console.error("failed to remove item", err);
    }
  };

  const handleRemoveAll = async () => {
    if (wishlist.length === 0) return;
    if (!window.confirm("Are you sure you want to remove all items from your wishlist?")) return;
    
    try {
      await clearWishlist();
      setWishlist([]);
    } catch (err) {
      console.error("failed to clear wishlist", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <BuyerSidebar
          buyerName={user.full_name || user.email}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 ml-0 md:ml-72 overflow-y-auto">
          {/* Header */}
          <div className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 -ml-2 mr-3 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Wishlist</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    All your saved gems in one place
                  </p>
                </div>
              </div>
              {wishlist.length > 0 && (
                <button
                  onClick={handleRemoveAll}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {wishlist.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm mt-10">
                  Your wishlist is empty.
                </div>
              )}
              {wishlist.map((item) => {
                const isSold = item.status?.toLowerCase() === 'sold';
                return (
                  <div
                    key={item.wishlist_id}
                    className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 group flex flex-col relative ${
                      isSold ? "opacity-70 pointer-events-none" : "hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer"
                    }`}
                    onClick={() => !isSold && navigate(`/product-detail/${item.gem_id}`)}
                  >
                    <div className="relative aspect-square bg-gray-50/50 p-6 flex-shrink-0">
                      <img
                        src={
                          item.image_url
                            ? (item.image_url.startsWith('http://') || item.image_url.startsWith('https://')
                                ? item.image_url
                                : getGemImageUrl(`uploads/gem_images/${item.image_url}`))
                            : "/placeholder-gem.png"
                        }
                        alt={item.gem_name}
                        className={`w-full h-full object-contain drop-shadow-sm transition-transform duration-500 ${isSold ? "grayscale opacity-80" : "group-hover:scale-110"}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                        }}
                      />
                      {isSold && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <span className="bg-black/70 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                      <button 
                        onClick={(e) => handleRemove(e, item.gem_id)}
                        className="absolute top-3 right-3 h-9 w-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 transition-colors z-20 pointer-events-auto"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="p-4 md:p-5 flex-1 flex flex-col justify-between border-t border-gray-50">
                      <div>
                        <h3 className={`font-bold transition-colors line-clamp-1 mb-1 ${isSold ? "text-gray-500" : "text-gray-900 group-hover:text-red-700"}`}>
                          {item.gem_name}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 mb-3">
                          {item.carat} ct • {item.cut}
                        </p>
                      </div>
                      <p className={`font-bold text-base ${isSold ? "text-gray-400 line-through" : "text-[#cc000b]"}`}>
                        LKR {Number(item.price).toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default WishlistPage;
