import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Settings, LayoutDashboard, Flower, Rows3, X, History, Home, Truck, Star } from "lucide-react";
import API_CONFIG from "../lib/api.config";

interface BuyerSidebarProps {
  buyerName: string;
  isOpen: boolean;
  onClose: () => void;
}

function BuyerSidebar({ buyerName, isOpen, onClose }: BuyerSidebarProps) {
  const navigate = useNavigate();
  const location = window.location;
  const [pendingReviewCount, setPendingReviewCount] = useState(0);

  useEffect(() => {
    const fetchPendingReviewsCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/reviews/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPendingReviewCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch pending reviews count", err);
      }
    };
    fetchPendingReviewsCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-[#fcfbf8] border-r flex flex-col justify-between overflow-hidden
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">{buyerName}</h2>
              <p className="text-xs text-gray-500">Buyer Dashboard</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 md:hidden" />
            </button>
          </div>

          <nav className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/")}
              className={"flex items-center gap-3 text-left w-full text-red-600 font-semibold hover:text-red-700 transition-colors duration-200 ease-in-out"}
            >
              <Home className="w-4 h-4" /> Home
            </button>

            <button
              onClick={() => navigate("/buyer/dashboard")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/dashboard' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>

            <button
              onClick={() => navigate("/buyer/orders/history")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/orders/history' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <History className="w-4 h-4" /> Order History
            </button>

            <button
              onClick={() => navigate("/buyer/order-status")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/order-status' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <Truck className="w-4 h-4" /> Order Status
            </button>

            <button
              onClick={() => navigate("/buyer/reviews")}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4" />
                <span className={location.pathname === '/buyer/reviews' ? 'underline decoration-black decoration-2' : 'group-hover:underline'}>
                  Reviews
                </span>
              </div>
              {pendingReviewCount > 0 && (
                <span className="bg-[#cc000b] text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center !no-underline">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/buyer/ai-designs")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/ai-designs' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <Flower className="w-4 h-4" /> My Designs
            </button>

            <button
              onClick={() => navigate("/buyer/wishlist")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/wishlist' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <Rows3 className="w-4 h-4" /> Wishlist
            </button>
          </nav>
        </div>

        <div className="p-6 border-t space-y-3">
          <button onClick={() => navigate("/buyer/settings")} className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/settings' ? ' underline decoration-black decoration-2' : ''}`}>
            <Settings className="w-4 h-4" /> Settings
          </button>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left text-red-600">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default BuyerSidebar;
