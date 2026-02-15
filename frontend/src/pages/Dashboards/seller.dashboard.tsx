import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from "../../components/BasicFooter";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, BadgeCheck, BanknoteArrowDown, Eye, MessageSquare, ChartNoAxesCombined, ArrowRight, Heart } from "lucide-react";
import EmptyState from "@/components/EmptyState";

function SellerDashboardLayout() {

    interface Gem {
        gem_id: number;
        gem_name: string;
        carat: number;
        cut: string;
        price: number;
        image_url: string | null;
    }

    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const token = localStorage.getItem("token");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [seller, setSeller] = useState<any>(null);
    const [gems, setGems] = useState<Gem[]>([]);
    const [gemsLoading, setGemsLoading] = useState(true);

    useEffect(() => {
        const fetchSellerProfile = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/seller/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch seller profile");

                const data = await res.json();
                setSeller(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSellerProfile();
    }, []);

    useEffect(() => {
        const fetchRecentGems = async () => {
            try {
                setGemsLoading(true);

                const res = await fetch("http://localhost:5001/api/seller/gems/recent", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch recent gems");
                }

                const data = await res.json();
                setGems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setGemsLoading(false);
            }
        };

        fetchRecentGems();
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(storedUser);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <SellerSidebar sellerName={user?.full_name || user?.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200">
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="ml-4 md:ml-0">
                        <h3 className="font-bold text-2xl">
                            Welcome back, {user?.full_name}
                        </h3>
                        <p className="flex items-center text-sm text-gray-500 gap-2">
                            <BadgeCheck className="text-[#1F7A73] size-5" />
                            {seller?.business_name || "Loading business..."}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/add-new-gem")}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#1F7A73] text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                        <Plus size={18} /> List New Gem
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                    {/* Total Revenue */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <BanknoteArrowDown className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Revenue</span>
                            <span className="text-2xl font-bold text-gray-900">$5,000</span>
                            <span className="text-xs text-green-600 mt-1">
                                +12% from last month
                            </span>
                        </div>
                    </div>

                    {/* Profile Views */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <Eye className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Profile Views</span>
                            <span className="text-2xl font-bold text-gray-900">456</span>
                            <span className="text-xs text-green-600 mt-1">
                                +8% this week
                            </span>
                        </div>
                    </div>

                    {/* Inquiry Rate */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <MessageSquare className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Inquiry Rate</span>
                            <span className="text-2xl font-bold text-gray-900">25%</span>
                            <span className="text-xs text-green-600 mt-1">
                                High engagement
                            </span>
                        </div>
                    </div>

                    {/* Wishlist Count */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <Heart className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Wishlisted Gems</span>
                            <span className="text-2xl font-bold text-gray-900">48</span>
                            <span className="text-xs text-gray-500 mt-1">
                                Across all listings
                            </span>
                        </div>
                    </div>

                </div>


                <div className="hidden md:flex flex-col gap-5 md:flex-row md:gap-4 mb-6 border-[#f5e2aa]">
                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex items-center justify-between p-4">
                        <div className="flex items-start">
                            <ChartNoAxesCombined className="text-[#1F7A73] size-15 mr-4" />
                            <div className="flex flex-col">
                                <h2 className="font-bold">AI Market Insight</h2>
                                <h2 className="text-sm text-gray-500">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                                    ut aliquip ex ea commodo consequat.
                                </h2>
                            </div>
                        </div>
                        <button className="bg-[#000000] text-white px-4 py-2 rounded-lg hover:bg-[#16635d]">
                            View Analysis
                        </button>
                    </div>
                </div>

                {/* Active Listings */}
                <h3
                    onClick={() => navigate("/seller/listings")}
                    className="flex items-center text-lg font-bold underline mt-10 cursor-pointer hover:text-[#1F7A73]"
                >
                    Active Listings <ArrowRight className="ml-2" />
                </h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6 mt-6">

                    {gemsLoading && (
                        <p className="col-span-full text-sm text-gray-500">
                            Loading active listings...
                        </p>
                    )}

                    {!gemsLoading && gems.length === 0 && (
                        <EmptyState
                            title="No active listings yet"
                            description="Start selling by listing your first gemstone on Gemellery."
                            ctaLabel="List your first gem"
                            ctaLink="/add-new-gem"
                        />
                    )}


                    {!gemsLoading && gems.map((gem) => (
                        <div
                            key={gem.gem_id}
                            className="rounded-2xl border border-[#e9dfc8] bg-white p-3"
                        >
                            <div className="relative">
                                <div className="rounded-2xl p-2">
                                    <img
                                        src={
                                            gem.image_url
                                                ? `http://localhost:5001/uploads/gem_images/${gem.image_url}`
                                                : "/placeholder-gem.png"
                                        }
                                        alt={gem.gem_name}
                                        className="w-full h-48 object-contain rounded-xl"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                                        }}
                                    />

                                </div>

                                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                                    <BadgeCheck className="h-4 w-4 text-[#1F7A73]" />
                                </button>
                            </div>

                            <div className="mt-3 space-y-1">
                                <h3 className="font-semibold text-sm text-gray-900">
                                    {gem.gem_name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {gem.carat} ct • {gem.cut}
                                </p>
                                <p className="font-bold text-red-500">
                                    ${Number(gem.price).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>


                <h3 className="flex items-center text-lg font-bold underline mt-10 mb-6">
                    Performance Status <ArrowRight className="ml-2" />
                </h3>
                <div className="flex flex-col md:flex-row gap-5 md:gap-4 mb-6 border-[#f5e2aa]">
                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex items-center justify-between p-4">
                        <div className="flex flex-col">
                            <h2 className="font-bold">Verification Rate</h2>
                            <h2 className="text-sm text-gray-500">98%</h2>
                        </div>
                    </div>

                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex items-center justify-between p-4">
                        <div className="flex flex-col">
                            <h2 className="font-bold">Active Shipments</h2>
                            <h2 className="text-sm text-gray-500">45</h2>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default SellerDashboardLayout;
