import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItem = (path: string, label: string, Icon: any, extra?: React.ReactNode) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-2xl transition-all duration-300 text-left group relative
        ${active
            ? "bg-white text-black shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100/50"
            : "text-gray-400 hover:text-black hover:bg-white/40"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-all duration-300 ${
            active 
              ? "bg-black text-white shadow-lg shadow-black/10 scale-110" 
              : "bg-gray-100/80 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:shadow-sm"
          }`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
          </div>
          <span className={`text-[13px] font-bold tracking-tight transition-colors duration-300 ${active ? "text-black" : ""}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {extra}
          {active && (
            <div className="w-1.5 h-1.5 rounded-full bg-black animate-[pulse_2s_infinite]" />
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 md:hidden transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-[#fcfbf8] border-r border-gray-200/50 flex flex-col overflow-hidden
        transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)] md:shadow-none`}
      >
        <div className="p-8 pb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                  {(buyerName || "B").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#fcfbf8] shadow-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-tight truncate px-1">{buyerName || "Buyer"}</h2>
                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100/80 border border-gray-200/50 mt-1">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Buyer Account</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 -right-14 p-3 bg-[#fcfbf8]/60 backdrop-blur-md text-gray-900 rounded-full md:hidden hover:bg-[#fcfbf8]/80 transition-all border border-white/40 shadow-2xl group flex items-center justify-center"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-black hover:shadow-md transition-all duration-300 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-[0.02]" />
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Store</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide space-y-8">
          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Activity</p>
            {navItem("/buyer/dashboard", "Overview", LayoutDashboard)}
            {navItem("/buyer/orders/history", "Order History", History)}
            {navItem("/buyer/order-status", "Live Tracking", Truck)}
            {navItem("/buyer/reviews", "My Reviews", Star, 
              pendingReviewCount > 0 && (
                <span className="bg-[#cc000b] text-white text-[10px] font-black px-2 py-0.5 rounded-[6px] shadow-sm">
                  {pendingReviewCount}
                </span>
              )
            )}
          </nav>

          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Discovery</p>
            {navItem("/buyer/ai-designs", "Studio Designs", Flower)}
            {navItem("/buyer/wishlist", "Wishlist", Rows3)}
          </nav>

          <nav className="space-y-1.5 pb-8">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Settings</p>
            {navItem("/buyer/settings", "Preferences", Settings)}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-2 border border-white/60">
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full p-3 rounded-3xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-red-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm">
                  <LogOut className="w-4 h-4 shrink-0 transition-transform" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest px-1">Sign Out</span>
              </div>
              <div className="bg-red-500 group-hover:bg-white w-2 h-2 rounded-full transition-colors mr-2" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default BuyerSidebar;
