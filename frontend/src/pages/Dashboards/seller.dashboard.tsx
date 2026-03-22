import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from "../../components/BasicFooter";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, BadgeCheck, BanknoteArrowDown, Package, ArrowRight, Heart, ShieldCheck, ShieldAlert, Clock, ShieldX } from "lucide-react";
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
                const res = await fetch("/api/seller/profile", {
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

                const res = await fetch("/api/seller/gems/recent", {
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
                const res = await fetch("/api/seller/dashboard-summary", {
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
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
            <SellerSidebar sellerName={user?.full_name || user?.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto">
                <div className="bg-white border-b border-gray-100 px-6 py-8 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100/80 text-gray-600 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h3 className="font-bold text-2xl tracking-tight text-gray-900">
                                Welcome back, {user?.full_name}
                            </h3>
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                                {seller?.verification_status === "approved" ? (
                                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                                )}
                                {seller?.business_name || "Loading business..."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/add-new-gem")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1F7A73] text-white font-medium rounded-xl shadow-lg shadow-teal-500/20 hover:bg-[#186660] hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto">
                        <Plus size={18} />
                        <span className="hidden md:inline">List New Gem</span>
                        <span className="md:hidden">List Gem</span>
                    </button>
                </div>

                <div className="px-6 pt-4 pb-6 md:px-10 md:pt-5 md:pb-10 max-w-7xl mx-auto">

                {/* Verification Status Banner */}
                {seller && (
                    <div className={`rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border ${seller.verification_status === "approved"
                        ? "bg-green-100 border-green-300"
                        : seller.verification_status === "pending"
                            ? "bg-yellow-50 border-yellow-200"
                            : seller.verification_status === "rejected"
                                ? "bg-red-50 border-red-200"
                                : "bg-orange-50 border-orange-200"
                        }`}>
                        <div className={`p-3 rounded-xl shrink-0 ${seller.verification_status === "approved"
                            ? "bg-green-200"
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
                            <h4 className={`font-semibold text-sm ${seller.verification_status === "approved"
                                ? "text-green-900"
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
                            <p className={`text-xs mt-0.5 ${seller.verification_status === "approved"
                                ? "text-green-700"
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
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${seller.verification_status === "approved"
                            ? "bg-green-300 text-green-900"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <BanknoteArrowDown className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                {dashboardStats ? `LKR ${Number(dashboardStats.totalRevenue).toLocaleString('en-US')}` : "—"}
                            </h3>
                            <span className={`text-xs font-medium ${dashboardStats?.revenueTrend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                {dashboardStats ? `${dashboardStats.revenueTrend >= 0 ? "+" : ""}${dashboardStats.revenueTrend}% this month` : ""}
                            </span>
                        </div>
                    </div>

                    {/* Total Listings */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Listings</p>
                            <h3 className="text-2xl font-bold text-gray-900">{dashboardStats?.totalListings ?? "—"}</h3>
                            <p className="text-xs text-gray-400">Available gems</p>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900">{dashboardStats?.totalOrders ?? "—"}</h3>
                            <p className="text-xs text-gray-400">All time</p>
                        </div>
                    </div>

                    {/* Wishlist Count */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Wishlisted Gems</p>
                            <h3 className="text-2xl font-bold text-gray-900">{dashboardStats?.wishlistCount ?? "—"}</h3>
                            <p className="text-xs text-gray-400">Across all listings</p>
                        </div>
                    </div>
                </div>

                {/* Active Listings */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Active Listings</h3>
                    <button
                        onClick={() => navigate("/seller/listings")}
                        className={`group text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${
                            gems.length > 4 
                            ? "text-gray-900 bg-white border border-gray-900 hover:bg-gray-900 hover:text-white px-3 py-1.5 rounded-lg shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        {gems.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors duration-300">
                                {gems.length}
                            </span>
                        )}
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">

                    {gemsLoading && (
                        [1,2,3,4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 animate-pulse">
                                <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))
                    )}

                    {!gemsLoading && gems.length === 0 && (
                        <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                            <EmptyState
                                title="No active listings yet"
                                description="Start selling by listing your first gemstone on Gemellery."
                                ctaLabel="List your first gem"
                                ctaLink="/add-new-gem"
                            />
                        </div>
                    )}

                    {!gemsLoading && gems.slice(0, 4).map((gem) => (
                        <div
                            key={gem.gem_id}
                            onClick={() => navigate(`/edit-gem/${gem.gem_id}`)}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
                        >
                            <div className="relative aspect-square bg-gray-50/50 p-4 flex-shrink-0">
                                <img
                                    src={gem.image_url || "/placeholder-gem.png"}
                                    alt={gem.gem_name}
                                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-600 px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                                    {gem.carat} ct
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-50">
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-[#1F7A73] transition-colors line-clamp-1 mb-1">
                                        {gem.gem_name}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-400 mb-3">{gem.cut}</p>
                                </div>
                                <p className="font-bold text-[#cc000b] text-base">
                                    LKR {Number(gem.price).toLocaleString('en-US')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>




                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Performance</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-500">Verification Rate</p>
                            <span className="text-sm font-bold text-[#1F7A73]">
                                {dashboardStats ? `${dashboardStats.verificationRate}%` : "—"}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1F7A73] rounded-full transition-all duration-700"
                                style={{ width: `${dashboardStats?.verificationRate || 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Gems approved vs. submitted</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Shipments</p>
                            <h3 className="text-2xl font-bold text-gray-900">{dashboardStats?.activeShipments ?? "—"}</h3>
                            <p className="text-xs text-gray-400 mt-1">Currently in transit</p>
                        </div>
                    </div>
                </div>

                </div>
                <Footer />
            </main>
        </div>
    );
}

export default SellerDashboardLayout;
