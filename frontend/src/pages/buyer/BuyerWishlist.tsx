
import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import { Heart } from "lucide-react";
import type { WishlistItem } from "../../lib/wishlist/types";
import { API_CONFIG } from "../../lib/api.config";



function WishlistPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/wishlist`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        setWishlist(data.items || data); // support both array and {items: array}
      } catch (err) {
        console.error("wishlist error", err);
      }
    };
    fetchWishlist();
  }, []);


  return (
    <div className="flex flex-col h-screen bg-[#fcfbf8]">
      <div className="flex flex-1 overflow-hidden">
        <BuyerSidebar
          buyerName={user.full_name || user.email}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 ml-0 md:ml-64 overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-sm sticky top-0 z-10">
            <div className="p-6 md:p-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Wishlist</h1>
                <p className="text-gray-600 text-sm">All your saved gems in one place</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 md:p-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
              {wishlist.length === 0 && (
                <p className="col-span-full text-sm text-gray-500 mt-10 text-center">
                  No items in wishlist.
                </p>
              )}
              {wishlist.map((item) => (
                <div
                  key={item.wishlist_id}
                  className="rounded-2xl border border-[#e9dfc8] bg-white p-3 shadow hover:shadow-lg transition"
                >
                  <div className="relative">
                    <div className="rounded-2xl p-2">
                      <img
                        src={
                          item.image_url
                            ? `${API_CONFIG.BASE_URL}/uploads/gem_images/${item.image_url}`
                            : "/placeholder-gem.png"
                        }
                        alt={item.gem_name}
                        className="w-full h-48 object-contain rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                        }}
                      />
                    </div>
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                      <Heart className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {item.gem_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.carat} ct • {item.cut}
                    </p>
                    <p className="font-bold text-red-500">
                      Rs {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default WishlistPage;
