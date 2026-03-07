import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";

interface Gem {
    gem_id: number;
    gem_name: string;
    gem_type: string;
    price: number;
    carat: number;
    color: string;
    cut: string;
    clarity: string;
    origin: string;
    ngja_certificate_no: string;
    ngja_certificate_url?: string;
    verification_status: "pending" | "approved" | "rejected";
    admin_comment?: string;
    business_name: string;
}

type Status = Gem["verification_status"];

const ROWS_PER_PAGE = 10;

const getStatusStyle = (status: Status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-800";
        case "approved":
            return "bg-green-100 text-green-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

function StatusCard({ title, count }: any) {
    return (
        <div className="bg-white p-5 rounded-lg shadow border">
            <h2 className="text-gray-500 text-sm">{title}</h2>
            <p className="text-2xl font-semibold mt-2">{count}</p>
        </div>
    );
}

function VerifyGems() {
    const [gems, setGems] = useState<Gem[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewGem, setReviewGem] = useState<Gem | null>(null);
    const [adminComment, setAdminComment] = useState("");
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadGems();
    }, []);

    const loadGems = async () => {
        const res = await fetch("http://localhost:5001/api/admin/gems", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setGems(Array.isArray(data) ? data : []);
    };

    // Filtering

    let filtered = gems.filter(
        (g) =>
            g.gem_name.toLowerCase().includes(search.toLowerCase()) ||
            g.business_name.toLowerCase().includes(search.toLowerCase()) ||
            g.ngja_certificate_no.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
        filtered = filtered.filter((g) => g.verification_status === statusFilter);
    }

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const countBy = (status: Status) =>
        gems.filter((g) => g.verification_status === status).length;

    // Status updating

    const updateStatus = async (
        id: number,
        status: "approved" | "rejected"
    ) => {
        if (status === "rejected" && !adminComment.trim()) {
            toast.error("Rejection reason is required");
            return;
        }

        setLoadingId(id);

        const res = await fetch(
            `http://localhost:5001/api/admin/gem/${id}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    admin_comment: adminComment,
                }),
            }
        );

        if (!res.ok) {
            toast.error("Failed to update gem");
            setLoadingId(null);
            return;
        }

        toast.success(`Gem ${status}`);
        setReviewGem(null);
        setAdminComment("");
        setLoadingId(null);
        loadGems();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={user.full_name || user.email}
                role={user.role}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
                {/* Mobile Header */}
                <div className="flex items-center gap-4 mb-6 md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Gem Verification Dashboard
                    </h1>
                </div>
                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                       Gem Verification Dashboard
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search gems..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg w-72"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as Status | "all");
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatusCard title="Pending" count={countBy("pending")} />
                    <StatusCard title="Approved" count={countBy("approved")} />
                    <StatusCard title="Rejected" count={countBy("rejected")} />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Gem</th>
                                <th className="p-4 text-left">Seller</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-center">Carat</th>
                                <th className="p-4 text-center">Price</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((g) => (
                                <tr key={g.gem_id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium text-teal-700">
                                        {g.gem_name}
                                    </td>
                                    <td className="p-4">{g.business_name}</td>
                                    <td className="p-4">{g.gem_type}</td>
                                    <td className="p-4 text-center">{g.carat}</td>
                                    <td className="p-4 text-center">${g.price}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(g.verification_status)}`}>
                                            {g.verification_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setReviewGem(g)}
                                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center p-6 text-gray-400">
                                        No gems found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 text-sm">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span>
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Review Modal */}

                {reviewGem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white w-275 max-w-[95vw] h-[90vh] rounded-xl shadow-xl flex overflow-hidden">

                            {/* Left — Details */}
                            <div className="w-1/2 p-6 overflow-y-auto border-r">

                                <h2 className="text-xl font-semibold mb-6">
                                    Gem Review Panel
                                </h2>

                                <div className="space-y-3 text-sm">

                                    <div><strong>Name:</strong> {reviewGem.gem_name}</div>
                                    <div><strong>Seller:</strong> {reviewGem.business_name}</div>
                                    <div><strong>Type:</strong> {reviewGem.gem_type}</div>
                                    <div><strong>Carat:</strong> {reviewGem.carat}</div>
                                    <div><strong>Price:</strong> ${reviewGem.price}</div>
                                    <div><strong>Color:</strong> {reviewGem.color}</div>
                                    <div><strong>Cut:</strong> {reviewGem.cut}</div>
                                    <div><strong>Clarity:</strong> {reviewGem.clarity}</div>
                                    <div><strong>Origin:</strong> {reviewGem.origin}</div>
                                    <div><strong>NGJA Certificate No:</strong> {reviewGem.ngja_certificate_no}</div>
                                    <div><strong>Status:</strong> {reviewGem.verification_status}</div>

                                </div>

                                {/* Comment */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium mb-1">
                                        Admin Comment (required if rejecting)
                                    </label>
                                    <textarea
                                        value={adminComment}
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        className="w-full border rounded p-2 text-sm"
                                        rows={4}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-6">

                                    <button
                                        disabled={loadingId === reviewGem.gem_id}
                                        onClick={() => updateStatus(reviewGem.gem_id, "approved")}
                                        className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        disabled={loadingId === reviewGem.gem_id}
                                        onClick={() => updateStatus(reviewGem.gem_id, "rejected")}
                                        className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => {
                                            setReviewGem(null);
                                            setAdminComment("");
                                        }}
                                        className="px-5 py-2 bg-gray-300 rounded"
                                    >
                                        Close
                                    </button>

                                </div>
                            </div>

                            {/* Right — Certificate */}
                            <div className="w-1/2 bg-gray-50 p-4 flex flex-col">

                                <h3 className="text-sm font-medium mb-3">
                                    Certificate Preview
                                </h3>

                                <div className="flex-1 border rounded bg-white overflow-hidden">

                                    {reviewGem.ngja_certificate_url ? (
                                        <iframe
                                            src={`http://localhost:5001/uploads/gem_certificates/${reviewGem.ngja_certificate_url}`}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            No Certificate Uploaded
                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyGems;