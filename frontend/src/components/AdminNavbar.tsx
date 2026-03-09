import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import AdminProfileModal from "./AdminProfileModal";

interface AdminNavbarProps {
  adminName: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
}

interface AdminUser {
  email?: string;
  full_name?: string;
  mobile?: string;
  role?: string;
  status?: string;
  joined_date?: string;
  updated_at?: string;
  country_id?: number;
}

function AdminNavbar({
  adminName,
  onOpenSidebar,
  onLogout,
}: AdminNavbarProps) {

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      setAdmin(data);

    } catch (error) {
      console.error("Failed to load profile", error);
    }

  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#fcfbf8] border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">

          {/* Left */}
          <div className="flex items-center gap-4">

            <button
              onClick={onOpenSidebar}
              className="md:hidden text-gray-600 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Manage platform operations
              </p>
            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-6">

            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >

                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                  {adminName?.charAt(0)}
                </div>

                <span className="text-sm hidden sm:block">
                  {adminName}
                </span>

                <ChevronDown className="w-4 h-4 text-gray-500" />

              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-sm py-2">

                  <button
                    onClick={() => {
                      fetchProfile();
                      setProfileModalOpen(true);
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <div className="border-t my-1"></div>

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>
      </header>

      <AdminProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        admin={admin}
      />
    </>
  );
}

export default AdminNavbar;