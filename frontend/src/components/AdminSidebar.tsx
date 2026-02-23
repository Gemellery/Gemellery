import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Gem,
  ShieldCheck,
  Settings,
  LogOut,
  UserCog,
  FileText,
  Package,
  X,
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

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const navItem = (path: string, label: string, Icon: any) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 text-left
      ${isActive(path)
          ? "bg-black text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-black"
        }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

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
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen 
        bg-[#fcfbf8] border-r border-gray-200
        flex flex-col justify-between
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Top Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {adminName}
              </h2>
              <p className="text-xs text-gray-500 capitalize">
                {role.replace("_", " ")} Dashboard
              </p>
            </div>

            <button onClick={onClose}>
              <X className="w-5 h-5 md:hidden text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-2">
            {navItem("/admin/dashboard", "Dashboard", LayoutDashboard)}
            {navItem("/admin/verify-sellers", "Verify Sellers", ShieldCheck)}
            {navItem("/admin/manage-gems", "Manage Gems", Gem)}
            {navItem("/admin/manage-users", "Manage Users", Users)}
            {navItem("/admin/manage-orders", "Manage Orders", Package)}
            {navItem(
              "/admin/review-moderation",
              "Review Moderation",
              Users
            )}
            {navItem("/admin/reports", "Reports", FileText)}

            {isSuperAdmin && (
              <>
                <div className="border-t pt-4 mt-4 text-xs text-gray-400 uppercase tracking-wider">
                  System Controls
                </div>

                <div className="space-y-2 mt-2">
                  <button
                    onClick={() => setShowReAuthModal(true)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left
                    text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-200"
                  >
                    <UserCog className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">
                      Admin Management
                    </span>
                  </button>

                  {navItem(
                    "/admin/settings",
                    "System Settings",
                    Settings
                  )}
                </div>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
            text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
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