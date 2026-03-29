import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Gem,
  ShieldCheck,
  LogOut,
  UserCog,
  FileText,
  Package,
  X,
  FileCog,
  Home
} from "lucide-react";
import ReAuthModal from "./admin/ReAuthModal";

interface AdminSidebarProps {
  adminName: string;
  role: "admin" | "super_admin";
  isOpen: boolean;
  onClose: () => void;
}

function AdminSidebar({
  adminName,
  role,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = role?.toLowerCase() === "super_admin";
  const [showReAuthModal, setShowReAuthModal] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItem = (path: string, label: string, Icon: any) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl transition-all duration-300 text-left group relative
        ${active
            ? "bg-white text-black shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100/50"
            : "text-gray-400 hover:text-black hover:bg-white/40"
          }`}
      >
        <div className={`p-2 rounded-xl transition-all duration-300 ${
          active 
            ? "bg-black text-white shadow-lg shadow-black/10 scale-110" 
            : "bg-gray-100/80 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:shadow-sm"
        }`}>
          <Icon className="w-3.5 h-3.5 shrink-0" />
        </div>
        <span className={`text-[13px] font-bold tracking-tight transition-colors duration-300 ${active ? "text-black" : ""}`}>{label}</span>
        {active && (
          <div className="ml-auto flex items-center pr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-black animate-[pulse_2s_infinite]" />
          </div>
        )}
      </button>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40 md:hidden transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-screen 
        bg-[#fcfbf8] border-r border-gray-200/50
        flex flex-col
        transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)] md:shadow-none`}
      >
        {/* Header Section */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                {(adminName || "A").charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#fcfbf8] shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-tight truncate px-1">
                {adminName || "Administrator"}
              </h2>
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100/80 border border-gray-200/50 mt-1">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 -right-14 p-3 bg-[#fcfbf8]/60 backdrop-blur-md text-gray-900 rounded-full md:hidden hover:bg-[#fcfbf8]/80 transition-all border border-white/40 shadow-2xl group flex items-center justify-center"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="space-y-1">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-black hover:shadow-md transition-all duration-300 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-[0.02]" />
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Store Front</span>
            </button>
          </div>
        </div>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide space-y-8">
          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
              Intelligence
            </p>
            {navItem("/admin/dashboard", "Platform Insights", LayoutDashboard)}
            {navItem("/admin/reports", "Global Analytics", FileText)}
          </nav>

          <nav className="space-y-1.5">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
              Management
            </p>
            {navItem("/admin/verify-sellers", "Seller Requests", ShieldCheck)}
            {navItem("/admin/manage-gems", "Curated Inventory", Gem)}
            {navItem("/admin/manage-users", "User Directory", Users)}
            {navItem("/admin/manage-orders", "Transaction Hub", Package)}
          </nav>

          <nav className="space-y-1.5 pb-8">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
              Governance
            </p>
            {navItem("/admin/review-moderation", "Moderation Queue", Users)}
            {navItem("/admin/blog-posts", "Editorial Engine", FileCog)}
            
            {isSuperAdmin && (
              <button
                onClick={() => setShowReAuthModal(true)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-left text-gray-400 hover:text-black hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-gray-100/80 text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                  <UserCog className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-bold tracking-tight">System Core</span>
              </button>
            )}
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

      {/* ReAuth Modal */}
      {showReAuthModal && (
        <ReAuthModal
          onClose={() => setShowReAuthModal(false)}
          onSuccess={() => {
            setShowReAuthModal(false);
            navigate("/admin/manage-admins");
          }}
        />
      )}
    </>
  );
}

export default AdminSidebar;