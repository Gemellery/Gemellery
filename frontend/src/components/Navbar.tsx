import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logos/Elegance Jewelry.png";
import { ShoppingCart, CircleUserRound, Search, Menu, X, Sparkles } from "lucide-react";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"Seller" | "Buyer" | null>(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.full_name || parsed.email);
      setUserRole(parsed.role);
    }
  }, []);

  const handleProfileRedirect = () => {
    if (userRole === "Seller") {
      navigate("/seller/dashboard");
    } else if (userRole === "Buyer") {
      navigate("/buyer/dashboard");
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/signin");
  // };

  return (
    <nav className="w-full border-b bg-[#fcfbf8]">
      <div className="px-4 md:px-20 py-4 flex items-center justify-between">

        <img
          src={logo}
          alt="Gemellery Logo"
          className="h-15 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="hidden md:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search Gemstones..."
            className="w-64 px-4 py-2 text-sm border rounded-lg focus:outline-none"
          />
          <Search className="w-4 h-4" />
        </div>

        <div className="hidden lg:flex items-center gap-10 text-lg font-medium">
          <button onClick={() => navigate("/marketplace")} className="hover:underline">
            Marketplace
          </button>
          <button onClick={() => navigate("/about")} className="hover:underline">
            About
          </button>
          <button onClick={() => navigate("/blog")} className="hover:underline">
            Blog
          </button>
          <button onClick={() => navigate("/contact")} className="hover:underline">
            Contact Us
          </button>
          <button
            onClick={() => navigate("/jewelry-designer")}
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D061]
             text-[#0A1128] font-semibold rounded-full shadow-lg 
             hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Design With AI
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/cart")}>
            <ShoppingCart className="w-5 h-5" />
          </button>

          {userName ? (
            <button
              onClick={handleProfileRedirect}
              className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-semibold">
                {userName}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {userRole}
              </span>
            </button>
          ) : (
            <button onClick={() => navigate("/signin")}>
              <CircleUserRound className="w-5 h-5" />
            </button>
          )}

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Gemstones..."
              className="w-full px-4 py-2 text-sm border rounded-lg"
            />
            <Search className="w-4 h-4" />
          </div>

          {userName && (
            <button onClick={handleProfileRedirect} className="md:flex flex-col items-start text-left">
              <span className="text-sm font-semibold">
                {userName}
              </span><br />
              <span className="text-xs text-gray-500 capitalize">
                {userRole}
              </span>
            </button>
          )}
          <button onClick={() => navigate("/about")} className="block w-full text-left">
            Marketplace
          </button>
          <button onClick={() => navigate("/shop")} className="block w-full text-left">
            About
          </button>
          <button onClick={() => navigate("/ai-studio")} className="block w-full text-left">
            Blog
          </button>
          <button onClick={() => navigate("/sellers")} className="block w-full text-left">
            Contact Us
          </button>
          <button
            onClick={() => { navigate("/jewelry-designer"); setMenuOpen(false); }}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D061]
             text-[#0A1128] font-semibold rounded-full shadow-lg 
             hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Design With AI
          </button>


          {/* Auth */}
          {/* {userName && (
            <button onClick={handleLogout} className="text-red-600">
              Logout
            </button>
          )} */}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
