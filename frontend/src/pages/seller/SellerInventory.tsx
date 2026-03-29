import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import {
  Menu,
  Search,
  Gem,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Pencil,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/BasicFooter";
import API_CONFIG from "../../lib/api.config";

interface GemItem {
  gem_id: number;
  gem_name: string;
  gem_type: string;
  carat: number;
  cut: string;
  clarity: string;
  color: string;
  origin: string;
  price: number;
  status: string;
  verification_status: string;
  created_at: string;
  image_url: string | null;
}

interface Summary {
  total: number;
  available: number;
  unavailable: number;
  sold: number;
  pending: number;
  approved: number;
  rejected: number;
}

const verificationBadge: Record<string, { label: string; style: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Approved", style: "bg-green-100 text-green-800", icon: CheckCircle2 },
  pending: { label: "Pending", style: "bg-yellow-100 text-yellow-800", icon: Clock },
  rejected: { label: "Rejected", style: "bg-red-100 text-red-800", icon: XCircle },
  available: { label: "Available", style: "bg-green-100 text-green-800", icon: CheckCircle2 },
};

const statusBadge: Record<string, { label: string; style: string }> = {
  Available: { label: "Available", style: "bg-emerald-100 text-emerald-800" },
  Reserved: { label: "Reserved", style: "bg-gray-100 text-gray-600" },
  Sold: { label: "Sold", style: "bg-purple-100 text-purple-800" },
};

type FilterTab = "all" | "Available" | "Reserved" | "Sold" | "pending" | "rejected";

/** Handles both full S3 URLs (from createGem) and bare filenames (from updateGem) */
function getGemImageSrc(image_url: string | null): string {
  if (!image_url) return "/placeholder-gem.png";
  // Already a full URL (http/https) — use as-is
  if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
    return image_url;
  }
  // Bare filename — build the path via the backend uploads folder
  return `${API_CONFIG.BASE_URL}/uploads/gem_images/${image_url}`;
}

export default function SellerInventory() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gems, setGems] = useState<GemItem[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, available: 0, unavailable: 0, sold: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Pagination state and logic
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const paginatedGems: GemItem[] = gems.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(gems.length / pageSize);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === "Available" || filter === "Reserved" || filter === "Sold") {
        params.set("status", filter);
      }
      if (filter === "pending" || filter === "rejected") {
        params.set("verification_status", filter);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/inventory?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const json = await res.json();
      setGems(json.gems);
      setSummary(json.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInventory();
  };

  const toggleStatus = async (gem: GemItem) => {
    const newStatus = gem.status === "Available" ? "Reserved" : "Available";
    try {
      setTogglingId(gem.gem_id);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/gems/${gem.gem_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchInventory();
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All Gems", count: summary.total },
    { key: "Available", label: "Available", count: summary.available },
    { key: "Reserved", label: "Reserved", count: summary.unavailable },
    { key: "Sold", label: "Sold", count: summary.sold },
    { key: "pending", label: "Pending", count: summary.pending },
    { key: "rejected", label: "Rejected", count: summary.rejected },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <SellerSidebar
        sellerName={user?.full_name || user?.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-72 overflow-y-auto bg-[#faf9f6] flex flex-col">
        <div className="p-6 md:p-8 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-200 mr-2">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">Inventory</h1>
            </div>
            <button
              onClick={() => navigate("/add-new-gem")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1F7A73] text-white rounded-lg hover:bg-[#186660] text-sm"
            >
              <Plus className="w-4 h-4" /> Add New Gem
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Gem className="w-4 h-4" /> Total Gems
              </div>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" /> Available
              </div>
              <p className="text-2xl font-bold">{summary.available}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-yellow-600 text-sm mb-1">
                <Clock className="w-4 h-4" /> Pending Verification
              </div>
              <p className="text-2xl font-bold">{summary.pending}</p>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-2 text-red-600 text-sm mb-1">
                <AlertCircle className="w-4 h-4" /> Rejected
              </div>
              <p className="text-2xl font-bold">{summary.rejected}</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                    filter === tab.key
                      ? "bg-[#1F7A73] text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 md:ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#1F7A73]"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-[#1F7A73] text-white rounded-lg text-sm hover:bg-[#186660]">
                Search
              </button>
            </form>
          </div>

          {/* Gems Table */}
          <div className="bg-white rounded-xl border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading inventory...</div>
            ) : gems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No gems found</p>
                <p className="text-sm mt-1">Try adjusting your filters or add a new gem.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 break-words">Gem</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 hidden md:table-cell break-words">Type</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 hidden md:table-cell break-words">Details</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 break-words">Price</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 break-words">Status</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 hidden md:table-cell break-words">Verification</th>
                        <th className="text-left p-2 sm:p-4 font-medium text-gray-600 break-words">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedGems.map((gem) => {
                        const vBadge = verificationBadge[gem.verification_status] || verificationBadge.pending;
                        const sBadge = statusBadge[gem.status] || statusBadge.Reserved;
                        const VIcon = vBadge.icon;
                        return (
                          <tr key={gem.gem_id} className="hover:bg-gray-50">
                            <td className="p-2 sm:p-4 align-top">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                 <img
                                   src={getGemImageSrc(gem.image_url)}
                                   alt={gem.gem_name}
                                   className="w-12 h-12 rounded-lg object-cover"
                                   onError={(e) => {
                                     (e.target as HTMLImageElement).src = "/placeholder-gem.png";
                                   }}
                                 />
                                <div>
                                  <p className="font-medium text-gray-900 break-words max-w-[100px] sm:max-w-[160px]">{gem.gem_name}</p>
                                  <p className="text-xs text-gray-500 md:hidden break-words max-w-[80px]">{gem.gem_type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 sm:p-4 text-gray-600 hidden md:table-cell break-words">{gem.gem_type}</td>
                            <td className="p-2 sm:p-4 text-gray-500 hidden md:table-cell break-words">
                              <span>{gem.carat} ct</span>
                              {gem.cut && <span> · {gem.cut}</span>}
                              {gem.color && <span> · {gem.color}</span>}
                            </td>
                            <td className="p-2 sm:p-4 font-semibold text-gray-900 break-words">
                              LKR {Number(gem.price).toLocaleString('en-US')}
                            </td>
                            <td className="p-2 sm:p-4 break-words">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${sBadge.style}`}>
                                {sBadge.label}
                              </span>
                            </td>
                            <td className="p-2 sm:p-4 hidden md:table-cell break-words">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${vBadge.style}`}>
                                <VIcon className="w-3 h-3" /> {vBadge.label}
                              </span>
                            </td>
                            <td className="p-2 sm:p-4 break-words">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => navigate(`/edit-gem/${gem.gem_id}`)}
                                  disabled={gem.status === "Sold"}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={gem.status === "Sold" ? "Cannot edit a sold gem" : "Edit"}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleStatus(gem)}
                                  disabled={togglingId === gem.gem_id || gem.status === "Sold"}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={gem.status === "Sold" ? "Cannot toggle a sold gem" : (gem.status === "Available" ? "Mark Unavailable" : "Mark Available")}
                                >
                                  {gem.status === "Available" ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 py-4">
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages || 1 }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-[#1F7A73] text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
