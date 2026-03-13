import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LayoutDashboard, Flower, Rows3, BadgeDollarSign, X, History, Home } from "lucide-react";

interface BuyerSidebarProps {
  buyerName: string;
  isOpen: boolean;
  onClose: () => void;
}

function BuyerSidebar({ buyerName, isOpen, onClose }: BuyerSidebarProps) {
  const navigate = useNavigate();
  const location = window.location;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-[#fcfbf8] border-r flex flex-col justify-between overflow-hidden
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">{buyerName}</h2>
              <p className="text-xs text-gray-500">Buyer Dashboard</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 md:hidden" />
            </button>
          </div>

          <nav className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/")}
              className={"flex items-center gap-3 text-left w-full text-red-600 font-semibold hover:text-red-700 transition-colors duration-200 ease-in-out"}
            >
              <Home className="w-4 h-4" /> Home
            </button>

            <button
              onClick={() => navigate("/buyer/dashboard")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/dashboard' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>

            <button
              onClick={() => navigate("/buyer/orders/history")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/orders/history' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <History className="w-4 h-4" /> Order History
            </button>

            <button
              onClick={() => navigate("/buyer/ai-designs")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/ai-designs' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <Flower className="w-4 h-4" /> My Designs
            </button>

            <button
              onClick={() => navigate("/buyer/wishlist")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/wishlist' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <Rows3 className="w-4 h-4" /> Wishlist
            </button>

            <button
              onClick={() => navigate("/buyer/payments")}
              className={`flex items-center gap-3 w-full text-left hover:underline${location.pathname === '/buyer/payments' ? ' underline decoration-black decoration-2' : ''}`}
            >
              <BadgeDollarSign className="w-4 h-4" /> Payment Methods
            </button>

          </nav>
        </div>

        <div className="p-6 border-t space-y-3">
          <button onClick={() => navigate("/buyer/settings")} className="flex items-center gap-3 w-full text-left hover:underline">
            <Settings className="w-4 h-4" /> Settings
          </button>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left text-red-600">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default BuyerSidebar;
