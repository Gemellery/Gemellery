import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/Elegance Jewelry.png";
import { ShoppingCart, CircleUserRound, Search, Menu, X } from "lucide-react";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.full_name || parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav className="w-full border-b bg-[#fcfbf8]">
      <div className="px-4 md:px-20 py-4 flex items-center justify-between">

        {/* LEFT: Logo */}
        <img
          src={logo}
          alt="Gemellery Logo"
          className="h-15 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP: Search */}
        <div className="hidden md:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Gemstones..."
            className="w-64 px-4 py-2 text-sm border rounded-lg focus:outline-none"
          />
          <Search className="w-4 h-4" />
        </div>

        {/* DESKTOP: Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-lg font-medium">
          <button onClick={() => navigate("/about")} className="hover:underline">
            Shop Gems
          </button>
          <button onClick={() => navigate("/shop")} className="hover:underline">
            AI Design Studio
          </button>
          <button onClick={() => navigate("/ai-studio")} className="hover:underline">
            About Us
          </button>
          <button onClick={() => navigate("/sellers")} className="hover:underline">
            Sellers
          </button>
        </div>

        {/* RIGHT: Cart + Auth */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-5 h-5" />
          </button>

          {userName ? (
            <span className="hidden md:inline text-sm font-semibold">
              {userName}
            </span>
          ) : (
            <button onClick={() => navigate("/signin")}>
              <CircleUserRound className="w-5 h-5" />
            </button>
          )}

          {/* MOBILE: Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-4">

          {/* Mobile Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Gemstones..."
              className="w-full px-4 py-2 text-sm border rounded-lg"
            />
            <Search className="w-4 h-4" />
          </div>

          {/* Mobile Links */}
          <button onClick={() => navigate("/about")} className="block w-full text-left">
            Shop Gems
          </button>
          <button onClick={() => navigate("/shop")} className="block w-full text-left">
            AI Design Studio
          </button>
          <button onClick={() => navigate("/ai-studio")} className="block w-full text-left">
            About Us
          </button>
          <button onClick={() => navigate("/sellers")} className="block w-full text-left">
            Sellers
          </button>

          {/* Auth */}
          {userName ? (
            <button onClick={handleLogout} className="text-red-600">
              Logout
            </button>
          ) : (
            <button onClick={() => navigate("/signin")}>
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
