import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import {
  Plus,
  Menu,
  AlignVerticalJustifyEnd,
  ImageDown,
  CalendarDays,
  Heart,
  ArrowRight,
} from "lucide-react";
import image from "../../assets/logos/example_ring.png";
import API_CONFIG from "../../lib/api.config";
import { getUserDesigns } from "../../lib/jewelry-designer/api";
import type { JewelryDesign } from "../../lib/jewelry-designer/types";

interface Summary {
  activeOrders: number;
  savedDesigns: number;
  upcomingAppointments: number;
}

interface RecentOrder {
  order_id: number;
  order_status: string;
  total_amount: number;
  created_at: string;
  gem_name?: string | null;
  image_url: string | null;
}

interface WishlistItem {
  wishlist_id: number;
  gem_id: number;
  gem_name: string;
  carat: number;
  cut: string;
  price: number;
  image_url: string | null;
}

function BuyerDashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState<Summary>({
    activeOrders: 0,
    savedDesigns: 0,
    upcomingAppointments: 0,
  });
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [designs, setDesigns] = useState<JewelryDesign[]>([]);
  const [designsLoading, setDesignsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Dashboard token:", token);

    if (!token) {
      console.log("No token, skipping fetches");
      return;
    }

    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/api/buyer/dashboard-summary`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("summary status", res.status);
        if (!res.ok) return;
        const data = await res.json();
        console.log("summary data", data);
        setSummary(data);
      } catch (err) {
        console.error("summary error", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/api/buyer/orders/recent`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("orders status", res.status);
        const text = await res.text();
        console.log("orders raw response:", text);
        if (!res.ok) return;
        const data = JSON.parse(text);
        console.log("orders parsed:", data);
        setOrders(data);
      } catch (err) {
        console.error("orders error", err);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/wishlist`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("wishlist status", res.status);
        if (!res.ok) return;
        const data = await res.json();
        console.log("wishlist data", data);
        setWishlist(data);
      } catch (err) {
        console.error("wishlist error", err);
      }
    };

    fetchSummary();
    fetchOrders();
    fetchWishlist();

    // Fetch saved designs
    getUserDesigns()
      .then((data) => setDesigns(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => setDesigns([]))
      .finally(() => setDesignsLoading(false));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full">
        {/* Header container */}
        <div className="bg-white border-b border-gray-100 px-6 py-8 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100/80 text-gray-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h3 className="font-bold text-2xl tracking-tight text-gray-900">
                Welcome back, {user.full_name}
              </h3>
              <p className="text-gray-500 mt-1">
                Manage your collection, track orders, and design new pieces.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/jewelry-designer")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#cc000b] text-white font-medium rounded-xl shadow-lg shadow-red-500/30 hover:bg-[#aa0009] hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
          >
            <Plus size={18} /> <span className="hidden md:inline">New AI Design</span>
            <span className="md:hidden">New Design</span>
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <AlignVerticalJustifyEnd className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{summary.activeOrders}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ImageDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Saved Designs</p>
                <h3 className="text-2xl font-bold text-gray-900">{summary.savedDesigns}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Appointments</p>
                <h3 className="text-2xl font-bold text-gray-900">{summary.upcomingAppointments}</h3>
              </div>
            </div>
          </div>

          {/* Recent order section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Recent Orders
              </h3>
              <button 
                onClick={() => navigate("/buyer/orders/history")}
                className={`group text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${
                  orders.length > 4 
                    ? "text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white px-3 py-1.5 rounded-lg shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {orders.length > 4 && (
                  <span className="bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors duration-300">
                    {orders.length}
                  </span>
                )}
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No recent orders found.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.order_id}
                      className="p-4 md:px-6 md:py-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img
                            src={
                                order.image_url
                                ? `${API_CONFIG.BASE_URL}/uploads/gem_images/${order.image_url}`
                                : image
                            }
                            alt="Order item"
                            className="w-full h-full object-contain rounded-lg"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = image;
                            }}
                            />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">
                            {order.gem_name || `Order #${order.order_id}`}
                          </p>
                          <p className="text-sm text-gray-400 font-medium mt-1">
                            <span className="text-gray-500 font-semibold mr-2">Order #{order.order_id}</span>
                            • {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-gray-900">
                          LKR {Number(order.total_amount).toLocaleString()}
                        </span>
                        
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize tracking-wide ${
                            order.order_status.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                            order.order_status.toLowerCase() === 'processing' ? 'bg-blue-50 text-blue-700' :
                            order.order_status.toLowerCase() === 'shipped' ? 'bg-purple-50 text-purple-700' :
                            order.order_status.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                            {order.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </section>

          {/* Wishlist */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Your Wishlist
              </h3>
              <button 
                onClick={() => navigate("/buyer/wishlist")}
                className={`group text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${
                  wishlist.length > 4 
                    ? "text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white px-3 py-1.5 rounded-lg shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {wishlist.length > 4 && (
                  <span className="bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors duration-300">
                    {wishlist.length}
                  </span>
                )}
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  Your wishlist is empty.
                </div>
              )}

              {wishlist.slice(0, 4).map((item) => (
                <div
                  key={item.wishlist_id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/product-detail/${item.gem_id}`)}
                >
                  <div className="relative aspect-square bg-gray-50/50 p-6 flex-shrink-0">
                    <img
                      src={
                        item.image_url
                          ? (item.image_url.startsWith('http://') || item.image_url.startsWith('https://')
                              ? item.image_url
                              : `${API_CONFIG.BASE_URL}/uploads/gem_images/${item.image_url}`)
                          : "/placeholder-gem.png"
                      }
                      alt={item.gem_name}
                      className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-gem.png";
                      }}
                    />
                    <button className="absolute top-3 right-3 h-9 w-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 transition-colors z-10">
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between border-t border-gray-50">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1 mb-1">
                        {item.gem_name}
                      </h3>
                      <p className="text-xs font-medium text-gray-400 mb-3">
                        {item.carat} ct • {item.cut}
                      </p>
                    </div>
                    <p className="font-bold text-[#cc000b] text-base">
                      LKR {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>


          </section>

          {/* AI Designs */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Your Designs
              </h3>
              <button
                onClick={() => navigate("/buyer/ai-designs")}
                className={`group text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${
                  designs.length > 4 
                    ? "text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white px-3 py-1.5 rounded-lg shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {designs.length > 4 && (
                  <span className="bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors duration-300">
                    {designs.length}
                  </span>
                )}
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {designsLoading ? (
                /* Skeleton Loaders */
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-3/4 mx-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/2 mx-1 mt-2" />
                  </div>
                ))
              ) : designs.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  No saved designs yet. <button onClick={() => navigate("/jewelry-designer")} className="text-[#cc000b] font-semibold hover:underline">Create your first design</button>
                </div>
              ) : (
                designs.slice(0, 4).map((design) => {
                const thumb = design.generatedImages?.[0]?.thumbnailUrl || design.generatedImages?.[0]?.url || null;
                return (
                  <div
                    key={design.id}
                    onClick={() => navigate(`/jewelry-designer/design/${design.id}`)}
                    className="bg-white rounded-2xl border border-gray-100 p-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={`${design.gemType} ${design.gemCut}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-xs">No preview</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-gray-600 shadow-sm z-20">
                        {design.gemType || "Design"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-1 pb-1 truncate">
                      {design.designPrompt?.slice(0, 40) || design.gemCut}
                    </p>
                  </div>
                );
              }))}
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default BuyerDashboardLayout;
