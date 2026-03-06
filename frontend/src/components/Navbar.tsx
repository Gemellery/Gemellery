import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/Elegance Jewelry.png";
import { ShoppingCart, CircleUserRound, Search, Menu, X, Sparkles } from "lucide-react";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  type UserRole = "buyer" | "seller" | "admin" | "super_admin";
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const formatRole = (role: string) =>
    role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.full_name || parsed.email);
      setUserRole(parsed.role?.toLowerCase());
    }
  }, []);

  const handleProfileRedirect = () => {
    if (!userRole) return;

    switch (userRole) {
      case "seller":
        navigate("/seller/dashboard");
        break;

      case "buyer":
        navigate("/buyer/dashboard");
        break;

      case "admin":
      case "super_admin":
        navigate("/admin/dashboard");
        break;

      default:
        navigate("/");
    }
  };


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/signin");
  // };

  return (
    <nav className="w-full sticky top-0 z-50 pt-6 md:pt-4">
      {/* Main navbar container with rounded bottom corners */}
      <div className="backdrop-blur-2xl bg-gradient-to-r from-white/40 via-white/35 to-white/40 border-b border-white/30 shadow-2xl mx-4 md:mx-8 lg:mx-12 mb-4 rounded-3xl">
        <div className="px-6 md:px-10 lg:px-16 py-3 flex items-center justify-between">

          {/* Logo */}
          <img
            src={logo}
            alt="Gemellery Logo"
            className="h-12 md:h-14 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={() => navigate("/")}
          />

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center bg-white/20 backdrop-blur rounded-full px-4 py-2 border border-white/40 hover:border-white/60 focus-within:border-[#D4AF37] transition-all duration-300">
            <input
              type="text"
              placeholder="Search Gemstones..."
              className="bg-transparent outline-none text-base text-gray-900 placeholder-gray-600 w-48 lg:w-64"
            />
            <Search className="w-4 h-4 text-gray-700" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: "Marketplace", path: "/marketplace" },
              { label: "About", path: "/about" },
              { label: "Blog", path: "/blog" },
              { label: "Contact Us", path: "/contact" },
            ].map((nav) => (
              <button
                key={nav.path}
                onClick={() => navigate(nav.path)}
                className="relative px-4 py-2 text-base font-medium text-gray-900 group">
                {nav.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D061] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* AI Design Button */}
          <button
            onClick={() => navigate("/jewelry-designer")}
            className="hidden lg:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F5D061]
             text-[#0A1128] font-semibold text-base rounded-full shadow-lg 
             hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur">
            <Sparkles className="w-4 h-4" />
            AI Design
          </button>

          {/* Right Side Icons & User Menu */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Cart Icon */}
            <button 
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 text-gray-900 hover:text-[#D4AF37]">
              <ShoppingCart className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-white/20"></div>

            {/* User Profile Section */}
            {userName ? (
              <button
                onClick={handleProfileRedirect}
                className="hidden md:flex items-center gap-3 px-3 py-2 hover:bg-white/20 rounded-full transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061] flex items-center justify-center text-xs font-bold text-[#0A1128]">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {userName.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-600 capitalize">
                    {userRole && formatRole(userRole)}
                  </span>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => navigate("/signin")}
                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-white/20 rounded-full transition-all duration-300 text-gray-900 hover:text-[#D4AF37]">
                <CircleUserRound className="w-5 h-5" />
                <span className="text-base font-medium">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-white/20 rounded-full transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-4 bg-white/40 backdrop-blur-2xl border border-white/30 rounded-2xl p-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="flex items-center bg-white/20 backdrop-blur rounded-full px-3 py-2 border border-white/40 focus-within:border-[#D4AF37] transition-all duration-300">
            <input
              type="text"
              placeholder="Search Gemstones..."
              className="bg-transparent outline-none text-base text-gray-900 placeholder-gray-600 w-full"
            />
            <Search className="w-4 h-4 text-gray-700" />
          </div>

          {/* Mobile Navigation */}
          {[
            { label: "Marketplace", path: "/marketplace" },
            { label: "About", path: "/about" },
            { label: "Blog", path: "/blog" },
            { label: "Contact Us", path: "/contact" },
          ].map((nav) => (
            <button
              key={nav.path}
              onClick={() => { navigate(nav.path); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-base text-gray-900 hover:bg-white/20 hover:text-[#D4AF37] rounded-lg transition-all duration-300 font-medium">
              {nav.label}
            </button>
          ))}

          {/* Mobile User Profile */}
          {userName && (
            <div className="px-4 py-3 bg-white/10 rounded-lg border border-white/20">
              <span className="text-base font-semibold text-gray-900">
                {userName}
              </span>
              <p className="text-sm text-gray-600 capitalize mt-1">
                {userRole && formatRole(userRole)}
              </p>
              <button
                onClick={() => { handleProfileRedirect(); setMenuOpen(false); }}
                className="mt-2 w-full px-4 py-2 bg-white/20 hover:bg-white/30 text-gray-900 rounded-lg text-base font-medium transition-all duration-300">
                View Profile
              </button>
            </div>
          )}

          {/* Mobile AI Button */}
          <button
            onClick={() => { navigate("/jewelry-designer"); setMenuOpen(false); }}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D061] text-[#0A1128] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Design With AI
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
