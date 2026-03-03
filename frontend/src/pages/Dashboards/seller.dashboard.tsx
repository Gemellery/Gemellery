import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from "../../components/BasicFooter";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, BadgeCheck, BanknoteArrowDown, Package, ChartNoAxesCombined, ArrowRight, Heart, ShieldCheck, ShieldAlert, Clock, ShieldX } from "lucide-react";
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
    const [dashboardStats, setDashboardStats] = useState<any>(null);

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

    useEffect(() => {
        const fetchDashboardSummary = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/seller/dashboard-summary", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch dashboard summary");
                const data = await res.json();
                setDashboardStats(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboardSummary();
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
                            {seller?.verification_status === "approved" ? (
                                <BadgeCheck className="text-[#1F7A73] size-5" />
                            ) : (
                                <ShieldAlert className="text-yellow-500 size-5" />
                            )}
                            {seller?.business_name || "Loading business..."}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/add-new-gem")}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#1F7A73] text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                        <Plus size={18} /> List New Gem
                    </button>
                </div>

                {/* Verification Status Banner */}
                {seller && (
                    <div className={`rounded-2xl p-4 mb-6 flex items-center gap-4 border ${
                        seller.verification_status === "approved"
                            ? "bg-green-50 border-green-200"
                            : seller.verification_status === "pending"
                            ? "bg-yellow-50 border-yellow-200"
                            : seller.verification_status === "rejected"
                            ? "bg-red-50 border-red-200"
                            : "bg-orange-50 border-orange-200"
                    }`}>
                        <div className={`p-3 rounded-xl ${
                            seller.verification_status === "approved"
                                ? "bg-green-100"
                                : seller.verification_status === "pending"
                                ? "bg-yellow-100"
                                : seller.verification_status === "rejected"
                                ? "bg-red-100"
                                : "bg-orange-100"
                        }`}>
                            {seller.verification_status === "approved" && <ShieldCheck className="text-green-600 size-6" />}
                            {seller.verification_status === "pending" && <Clock className="text-yellow-600 size-6" />}
                            {seller.verification_status === "rejected" && <ShieldX className="text-red-600 size-6" />}
                            {seller.verification_status === "suspended" && <ShieldAlert className="text-orange-600 size-6" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${
                                seller.verification_status === "approved"
                                    ? "text-green-800"
                                    : seller.verification_status === "pending"
                                    ? "text-yellow-800"
                                    : seller.verification_status === "rejected"
                                    ? "text-red-800"
                                    : "text-orange-800"
                            }`}>
                                {seller.verification_status === "approved" && "Verified Seller"}
                                {seller.verification_status === "pending" && "Verification Pending"}
                                {seller.verification_status === "rejected" && "Verification Rejected"}
                                {seller.verification_status === "suspended" && "Account Suspended"}
                            </h4>
                            <p className={`text-xs mt-0.5 ${
                                seller.verification_status === "approved"
                                    ? "text-green-600"
                                    : seller.verification_status === "pending"
                                    ? "text-yellow-600"
                                    : seller.verification_status === "rejected"
                                    ? "text-red-600"
                                    : "text-orange-600"
                            }`}>
                                {seller.verification_status === "approved" && "Your seller account has been verified. You can list and sell gems."}
                                {seller.verification_status === "pending" && "Your account is under review. You'll be notified once verified by an admin."}
                                {seller.verification_status === "rejected" && "Your verification was rejected. Please contact support for more details."}
                                {seller.verification_status === "suspended" && "Your account has been suspended. Please contact support to resolve this."}
                            </p>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                            seller.verification_status === "approved"
                                ? "bg-green-200 text-green-800"
                                : seller.verification_status === "pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : seller.verification_status === "rejected"
                                ? "bg-red-200 text-red-800"
                                : "bg-orange-200 text-orange-800"
                        }`}>
                            {seller.verification_status.charAt(0).toUpperCase() + seller.verification_status.slice(1)}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                    {/* Total Revenue */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <BanknoteArrowDown className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Revenue</span>
                            <span className="text-2xl font-bold text-gray-900">
                                ${dashboardStats ? `LKR ${Number(dashboardStats.totalRevenue).toLocaleString()}` : "Loading..."}
                            </span>
                            <span className={`text-xs mt-1 ${dashboardStats?.revenueTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {dashboardStats ? `${dashboardStats.revenueTrend >= 0 ? "+" : ""}${dashboardStats.revenueTrend}% from last month` : ""}
                            </span>
                        </div>
                    </div>

                    {/* Total Listings */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <Package className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Active Listings</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {dashboardStats?.totalListings ?? "Loading..."}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                Available gems
                            </span>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="group bg-[#f8f0d9] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="p-4 rounded-xl bg-white">
                            <BadgeCheck className="text-[#1F7A73] size-7" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Orders</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {dashboardStats?.totalOrders ?? "Loading..."}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                All time
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
                            <span className="text-2xl font-bold text-gray-900">
                                {dashboardStats?.wishlistCount ?? "Loading..."}
                            </span>
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
                        <button
                            onClick={() => navigate("/jewelry-designer")}
                            className="bg-[#000000] text-white px-4 py-2 rounded-lg hover:bg-[#16635d]">
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
                            <h2 className="text-sm text-gray-500">{dashboardStats ? `${dashboardStats.verificationRate}%` : "Loading..."}</h2>
                        </div>
                    </div>

                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex items-center justify-between p-4">
                        <div className="flex flex-col">
                            <h2 className="font-bold">Active Shipments</h2>
                            <h2 className="text-sm text-gray-500">{dashboardStats?.activeShipments ?? "Loading..."}</h2>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default SellerDashboardLayout;
