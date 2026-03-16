import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/Elegance Jewelry.png";
import { ShoppingCart, CircleUserRound, Search, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  type UserRole = "buyer" | "seller" | "admin" | "super_admin";
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  
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

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 pt-6 md:pt-4 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Main navbar container with rounded bottom corners */}
        <div className="backdrop-blur-2xl bg-gradient-to-r from-white/40 via-white/35 to-white/40 border-b border-white/30 shadow-2xl mx-4 md:mx-8 xl:mx-12 mb-4 rounded-3xl">
          <div className="px-5 md:px-8 xl:px-12 py-3 flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <img
                src={logo}
                alt="Gemellery Logo"
                className="h-10 md:h-12 lg:h-14 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm bg-white/20 backdrop-blur rounded-full px-4 py-2 border border-white/40 hover:border-white/60 focus-within:border-[#D4AF37] transition-all duration-300">
              <input
                type="text"
                placeholder="Search Gemstones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none text-[15px] text-gray-900 placeholder-gray-600 w-full"
              />
              <Search 
                className="w-4 h-4 text-gray-700 cursor-pointer hover:text-[#D4AF37] transition shrink-0" 
                onClick={handleSearchSubmit}
              />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1 xl:gap-2">
              {[
                { label: "Marketplace", path: "/marketplace" },
                { label: "About", path: "/about" },
                { label: "Blog", path: "/blog" },
                { label: "Contact Us", path: "/contact" },
              ].map((nav) => (
                <button
                  key={nav.path}
                  onClick={() => navigate(nav.path)}
                  className="relative px-3 py-2 text-[15px] font-medium text-gray-900 group whitespace-nowrap">
                  {nav.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D061] group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            {/* AI Design Button */}
            <button
              onClick={() => navigate("/jewelry-designer")}
              className="hidden xl:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F5D061]
              text-[#0A1128] font-semibold text-[15px] rounded-full shadow-lg 
              hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur whitespace-nowrap shrink-0">
              <Sparkles className="w-4 h-4" />
              AI Design
            </button>

            {/* Right Side Icons & User Menu */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              {/* Cart Icon */}
              <button 
                onClick={() => navigate("/cart")}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 text-gray-900 hover:text-[#D4AF37] relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#CE0024] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm translate-x-1 -translate-y-1">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-white/30"></div>

              {/* User Profile Section */}
              {userName ? (
                <button
                  onClick={handleProfileRedirect}
                  className="hidden md:flex items-center gap-2 xl:gap-3 px-3 py-1.5 hover:bg-white/20 rounded-full transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061] flex items-center justify-center text-xs font-bold text-[#0A1128] shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start whitespace-nowrap">
                    <span className="text-[13px] font-semibold text-gray-900 leading-tight">
                      {userName.split(" ")[0]}
                    </span>
                    <span className="text-[11px] text-gray-600 capitalize">
                      {userRole && formatRole(userRole)}
                    </span>
                  </div>
                </button>
              ) : (
                <button 
                  onClick={() => navigate("/signin")}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded-full transition-all duration-300 text-gray-900 hover:text-[#D4AF37] whitespace-nowrap">
                  <CircleUserRound className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden p-2 hover:bg-white/20 rounded-full transition-all duration-300"
                onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden mt-2 mx-4 bg-white/40 backdrop-blur-2xl border border-white/30 rounded-2xl p-4 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2">
            {/* Mobile Search */}
            <div className="lg:hidden flex items-center bg-white/20 backdrop-blur rounded-full px-3 py-2 border border-white/40 focus-within:border-[#D4AF37] transition-all duration-300">
              <input
                type="text"
                placeholder="Search Gemstones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none text-[15px] text-gray-900 placeholder-gray-600 w-full"
              />
              <Search 
                className="w-4 h-4 text-gray-700 cursor-pointer hover:text-[#D4AF37] transition shrink-0" 
                onClick={handleSearchSubmit}
              />
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
            {userName ? (
              <div className="md:hidden px-4 py-3 bg-white/10 rounded-lg border border-white/20">
                <span className="text-[15px] font-semibold text-gray-900">
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
            ) : (
              <button 
                  onClick={() => { navigate("/signin"); setMenuOpen(false); }}
                  className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-white/20 rounded-lg transition-all duration-300 text-gray-900 border border-white/20 font-medium text-[15px]">
                  <CircleUserRound className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
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
      </div>
    </nav>
  );
}

export default Navbar;
