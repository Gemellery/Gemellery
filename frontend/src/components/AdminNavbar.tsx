import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdminNavbarProps {
    adminName: string;
    onOpenSidebar: () => void;
    onLogout: () => void;
}

function AdminNavbar({
    adminName,
    onOpenSidebar,
    onLogout,
}: AdminNavbarProps) {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-[#fcfbf8] border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">

                {/* Left Section */}
                <div className="flex items-center gap-4">

                    {/* Mobile Menu Button */}
                    <button
                        onClick={onOpenSidebar}
                        className="md:hidden text-gray-600 hover:text-black transition"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-gray-800">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs text-gray-500">
                            Manage platform operations
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">

                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 text-sm rounded-lg bg-white border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30
              transition"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative cursor-pointer">
                        <Bell className="w-5 h-5 text-gray-600 hover:text-black transition" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></span>
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg
              hover:bg-gray-100 transition"
                        >
                            <div className="w-8 h-8 rounded-full bg-black text-white 
              flex items-center justify-center text-sm font-medium">
                                {adminName?.charAt(0)}
                            </div>

                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {adminName}
                            </span>

                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 
              rounded-xl shadow-sm py-2">
                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                    Profile
                                </button>

                                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                                    Settings
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
    );
}

export default AdminNavbar;