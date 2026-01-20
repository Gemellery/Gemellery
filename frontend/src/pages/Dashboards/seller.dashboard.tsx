import { useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import { Menu, Plus, BadgeCheck, BanknoteArrowDown, Eye, MessageSquare, ChartNoAxesCombined, ArrowRight, Heart } from "lucide-react";

function SellerDashboardLayout() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex">
            <SellerSidebar sellerName={user.full_name || user.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200">
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="ml-4 md:ml-0">
                        <h3 className="font-bold text-2xl">Welcome back, {user.full_name}</h3>
                        <p className="flex items-center text-sm text-gray-500">
                            <BadgeCheck className="text-[#1F7A73] mr-2 size-5" /> Verified Seller
                        </p>
                    </div>

                    <button
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#1F7A73] text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                        <Plus size={18} /> List New Gem
                    </button>
                </div>

                <div className="flex flex-col gap-5 md:flex-row md:gap-4 mb-6">
                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
                        <BanknoteArrowDown className="text-[#1F7A73] size-10" />
                        <h2 className="font-bold">Total Revenue</h2>
                        <h2 className="font-bold text-2xl">5000$</h2>
                    </div>
                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
                        <Eye className="text-[#1F7A73] size-10" />
                        <h2 className="font-bold">Profile Views</h2>
                        <h2 className="font-bold text-2xl">456</h2>
                    </div>
                    <div className="w-full md:flex-1 h-42 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
                        <MessageSquare className="text-[#1F7A73] size-10" />
                        <h2 className="font-bold">Inquiry Rate</h2>
                        <h2 className="font-bold text-2xl">25%</h2>
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
                <h3 className="flex items-center text-lg font-bold underline mt-10">
                    Active Listings <ArrowRight className="ml-2" />
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6 mt-6">
                    <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
                        <div className="relative">
                            <div className="rounded-2xl p-2">
                                <img
                                    src="/sample_gems/alexandrite_18.jpg"
                                    alt="Pink Tourmaline"
                                    className="w-full h-48 object-contain rounded-xl"
                                />
                            </div>
                            <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                                <BadgeCheck className="h-4 w-4 text-[#1F7A73]" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1">
                            <h3 className="font-semibold text-sm text-gray-900">
                                Pink Tourmaline
                            </h3>
                            <p className="text-xs text-gray-500">
                                1.2 ct • Cushion
                            </p>
                            <p className="font-bold text-red-500">
                                $1,200
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
                        <div className="relative">
                            <div className="rounded-2xl p-2">
                                <img
                                    src="/sample_gems/sapphire blue_6.jpg"
                                    alt="Pink Tourmaline"
                                    className="w-full h-48 object-contain rounded-xl"
                                />
                            </div>
                            <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                                <BadgeCheck className="h-4 w-4 text-[#1F7A73]" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1">
                            <h3 className="font-semibold text-sm text-gray-900">
                                Pink Tourmaline
                            </h3>
                            <p className="text-xs text-gray-500">
                                1.2 ct • Cushion
                            </p>
                            <p className="font-bold text-red-500">
                                $1,200
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
                        <div className="relative">
                            <div className="rounded-2xl p-2">
                                <img
                                    src="/sample_gems/sapphire blue_6.jpg"
                                    alt="Pink Tourmaline"
                                    className="w-full h-48 object-contain rounded-xl"
                                />
                            </div>
                            <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                                <BadgeCheck className="h-4 w-4 text-[#1F7A73]" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1">
                            <h3 className="font-semibold text-sm text-gray-900">
                                Pink Tourmaline
                            </h3>
                            <p className="text-xs text-gray-500">
                                1.2 ct • Cushion
                            </p>
                            <p className="font-bold text-red-500">
                                $1,200
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
                        <div className="relative">
                            <div className="rounded-2xl p-2">
                                <img
                                    src="/sample_gems/sapphire blue_6.jpg"
                                    alt="Pink Tourmaline"
                                    className="w-full h-48 object-contain rounded-xl"
                                />
                            </div>
                            <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                                <BadgeCheck className="h-4 w-4 text-[#1F7A73]" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1">
                            <h3 className="font-semibold text-sm text-gray-900">
                                Pink Tourmaline
                            </h3>
                            <p className="text-xs text-gray-500">
                                1.2 ct • Cushion
                            </p>
                            <p className="font-bold text-red-500">
                                $1,200
                            </p>
                        </div>
                    </div>
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
            </main>
        </div>
    );
}

export default SellerDashboardLayout;
