import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LayoutDashboard, ChartColumn,Container,Gem   } from "lucide-react";

interface SellerSidebarProps {
    sellerName: string;
}

function SellerSidebar({ sellerName }: SellerSidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <aside className="h-screen w-64 bg-[#fcfbf8] border-r flex flex-col justify-between">
            <div className="p-6">
                <h2 className="text-lg font-semibold">{sellerName}</h2>
                <p className="text-xs text-gray-500">Seller Dashboard</p>

                <nav className="mt-8 space-y-4">
                    <button
                        onClick={() => navigate("/seller/inventory")}
                        className="flex items-center gap-3 text-left w-full hover:underline">
                        <LayoutDashboard className="w-4 h-4" />
                        Inventory
                    </button>

                    <button
                        onClick={() => navigate("/seller/analytics")}
                        className="flex items-center gap-3 text-left w-full hover:underline">
                        <ChartColumn className="w-4 h-4" />
                        Analytics
                    </button>
                    <button
                        onClick={() => navigate("/seller/shipments")}
                        className="flex items-center gap-3 text-left w-full hover:underline">
                        <Container className="w-4 h-4" />
                        Shipments
                    </button>
                    <button
                        onClick={() => navigate("/seller/ai-studio")}
                        className="flex items-center gap-3 text-left w-full hover:underline">
                        <Gem className="w-4 h-4" />
                        AI Studio
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t space-y-3">
                <button
                    onClick={() => navigate("/seller/settings")}
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

export default SellerSidebar;
