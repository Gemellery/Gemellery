import { useNavigate } from "react-router-dom";
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
  X
} from "lucide-react";
import ReAuthModal from "./admin/ReAuthModal";

interface AdminSidebarProps {
  adminName: string;
  role: "admin" | "super_admin";
  isOpen: boolean;
  onClose: () => void;
}

function AdminSidebar({ adminName, role, isOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const isSuperAdmin = role?.toLowerCase() === "super_admin";
  const [showReAuthModal, setShowReAuthModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-[#fcfbf8] border-r flex flex-col justify-between overflow-hidden
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        {/* Top Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">{adminName}</h2>
              <p className="text-xs text-gray-500 capitalize">
                {role.replace("_", " ")} Dashboard
              </p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 md:hidden" />
            </button>
          </div>

          <nav className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/admin/verify-sellers")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Sellers
            </button>

            <button
              onClick={() => navigate("/admin/manage-gems")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <Gem className="w-4 h-4" />
              Manage Gems
            </button>

            <button
              onClick={() => navigate("/admin/manage-users")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/review-moderation")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <Users className="w-4 h-4" />
              Review Moderation
            </button>

            <button
              onClick={() => navigate("/admin/reports")}
              className="flex items-center gap-3 text-left w-full hover:underline"
            >
              <FileText className="w-4 h-4" />
              Reports
            </button>

            {isSuperAdmin && (
              <>
                <div className="border-t pt-4 mt-4 text-xs text-gray-400 uppercase">
                  System Controls
                </div>

                <button
                  onClick={() => setShowReAuthModal(true)}
                  className="flex items-center gap-3 text-left w-full hover:underline"
                >
                  <UserCog className="w-4 h-4" />
                  Admin Management
                </button>

                <button
                  onClick={() => navigate("/admin/settings")}
                  className="flex items-center gap-3 text-left w-full hover:underline"
                >
                  <Settings className="w-4 h-4" />
                  System Settings
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

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