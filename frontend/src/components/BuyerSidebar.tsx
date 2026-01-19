import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LayoutDashboard, Flower, Rows3, BadgeDollarSign } from "lucide-react";

interface BuyerSidebarProps {
  buyerName: string;
}

function BuyerSidebar({ buyerName }: BuyerSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="h-screen w-64 bg-[#fcfbf8] border-r flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-lg font-semibold">{buyerName}</h2>
        <p className="text-xs text-gray-500">Buyer Dashboard</p>

        <nav className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/buyer/dashboard")}
            className="flex items-center gap-3 w-full text-left hover:underline">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/buyer/ai-designs")}
            className="flex items-center gap-3 w-full text-left hover:underline">
            <Flower className="w-4 h-4" />
            My Designs
          </button>

          <button
            onClick={() => navigate("/buyer/wishlist")}
            className="flex items-center gap-3 w-full text-left hover:underline">
            <Rows3 className="w-4 h-4" />
            Wishlist
          </button>

          <button
            onClick={() => navigate("/buyer/payments")}
            className="flex items-center gap-3 w-full text-left hover:underline">
            <BadgeDollarSign className="w-4 h-4" />
            Payment Methods
          </button>
        </nav>
      </div>

      <div className="p-6 border-t space-y-3">
        <button
          onClick={() => navigate("/buyer/settings")}
          className="flex items-center gap-3 w-full text-left hover:underline">
          <Settings className="w-4 h-4" />
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left text-red-600">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default BuyerSidebar;
