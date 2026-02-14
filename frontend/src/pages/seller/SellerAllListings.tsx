import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import Footer from "../../components/BasicFooter";
import { Menu, BadgeCheck } from "lucide-react";

interface Gem {
    gem_id: number;
    gem_name: string;
    carat: number;
    cut: string;
    price: number;
    image_url: string | null;
}

function SellerAllListings() {

    useEffect(() => {
        const fetchAllGems = async () => {
            try {
                setLoading(true);

                const res = await fetch("http://localhost:5001/api/seller/gems", {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to load listings");
                }

                const data: Gem[] = await res.json();
                setGems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllGems();
    }, []);


    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [gems, setGems] = useState<Gem[]>([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden">
            <SellerSidebar
                sellerName={user.full_name || user.email}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-200"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <h1 className="text-2xl font-bold ml-4 md:ml-0">
                        All Active Listings
                    </h1>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-6">

                    {loading && (
                        <p className="col-span-full text-sm text-gray-500">
                            Loading active listings...
                        </p>
                    )}

                    {!loading && gems.length === 0 && (
                        <p className="col-span-full text-sm text-gray-500">
                            No active listings found.
                        </p>
                    )}

                    {!loading && gems.map((gem) => (
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
                                            (e.target as HTMLImageElement).src =
                                                "/placeholder-gem.png";
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


                <Footer />
            </main>
        </div>
    );
}

export default SellerAllListings;
