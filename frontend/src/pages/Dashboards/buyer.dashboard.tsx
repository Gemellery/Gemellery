import { useEffect, useState } from "react";
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
  image_url: string | null;
}

interface WishlistItem {
  wishlistid: number;
  gemid: number;
  gemname: string;
  carat: number;
  cut: string;
  price: number;
  image_url: string | null;
}

function BuyerDashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [summary, setSummary] = useState<Summary>({
    activeOrders: 0,
    savedDesigns: 0,
    upcomingAppointments: 0,
  });
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

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
          "http://localhost:5001/api/buyer/dashboard-summary",
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
          "http://localhost:5001/api/buyer/orders/recent",
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
        const res = await fetch("http://localhost:5001/api/buyer/wishlist", {
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
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="ml-4 md:ml-0">
            <h3 className="font-bold text-2xl">
              Welcome back, {user.full_name}
            </h3>
            <p className="text-sm text-gray-500">
              Manage your collection, track orders, and design new pieces.
            </p>
          </div>

          <button
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#cc000b]
            text-white font-semibold rounded-full shadow-lg
            hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <Plus size={18} /> New AI Design
          </button>
        </div>

        {/* Summary cards */}
        <div className="flex flex-col gap-5 md:flex-row md:gap-4 mb-6">
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <AlignVerticalJustifyEnd />
            <h2 className="font-bold">
              Active Orders - {summary.activeOrders}
            </h2>
          </div>
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <ImageDown />
            <h2 className="font-bold">
              Saved Designs - {summary.savedDesigns}
            </h2>
          </div>
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <CalendarDays />
            <h2 className="font-bold">
              Upcoming Appointments - {summary.upcomingAppointments}
            </h2>
          </div>
        </div>

        {/* Recent order section */}
        <div className="mt-10">
          <h3 className="flex items-center text-lg font-bold underline">
            Recent Orders <ArrowRight className="ml-2" />
          </h3>
          <div className="flex flex-col gap-4">
            {orders.length === 0 && (
              <p className="text-sm text-gray-500">No recent orders.</p>
            )}

            {orders.map((order) => (
              <div
                key={order.order_id}
                className="w-full h-24 bg-white rounded-xl shadow flex items-center justify-between px-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      order.image_url
                        ? `http://localhost:5001/uploads/gem_images/${order.image_url}`
                        : image
                    }
                    alt="Order"
                    className="w-12 h-12 rounded-md object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = image;
                    }}
                  />
                  <span className="font-semibold">
                    Order #{order.order_id}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Status: {order.order_status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wishlist */}
        <h3 className="flex items-center text-lg font-bold underline mt-10">
          Wish List <ArrowRight className="ml-2" />
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6 mt-6">
          {wishlist.length === 0 && (
            <p className="col-span-full text-sm text-gray-500">
              No items in wishlist.
            </p>
          )}

          {wishlist.map((item) => (
            <div
              key={item.wishlistid}
              className="rounded-2xl border border-[#e9dfc8] bg-white p-3"
            >
              <div className="relative">
                <div className="rounded-2xl p-2">
                  <img
                    src={
                      item.image_url
                        ? `http://localhost:5001/uploads/gem_images/${item.image_url}`
                        : "/placeholder-gem.png"
                    }
                    alt={item.gemname}
                    className="w-full h-48 object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-gem.png";
                    }}
                  />
                </div>
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                  <Heart className="h-4 w-4 text-red-500" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="font-semibold text-sm text-gray-900">
                  {item.gemname}
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

        {/* AI Designs (still static) */}
        <h3 className="flex items-center text-lg font-bold underline mt-10">
          Your AI Designs <ArrowRight className="ml-2" />
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-6 mt-6">
          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default BuyerDashboardLayout;
