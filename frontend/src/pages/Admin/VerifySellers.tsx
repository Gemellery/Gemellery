import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";

interface Seller {
    seller_id: number;
    business_name: string;
    email: string;
    ngja_registration_no: string;
    seller_license_url?: string;
    verification_status: "pending" | "approved" | "rejected" | "suspended";
}

type Status = Seller["verification_status"];

const ROWS_PER_PAGE = 10;

const actionLabels: Record<string, string> = {
    approved: "Approve",
    rejected: "Reject",
    suspended: "Suspend",
};

function VerifySellers() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [reviewSeller, setReviewSeller] = useState<Seller | null>(null);
    const [verifiedCheck, setVerifiedCheck] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadSellers();
    }, []);

    const loadSellers = async () => {
        const res = await fetch("http://localhost:5001/api/admin/pending-sellers", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
    };

    let filtered = sellers.filter(
        (s) =>
            s.business_name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.ngja_registration_no.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
        filtered = filtered.filter((s) => s.verification_status === statusFilter);
    }

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const countBy = (status: Status) =>
        sellers.filter((s) => s.verification_status === status).length;

    const getAllowedActions = (status: Status): Status[] => {
        switch (status) {
            case "pending":
                return ["approved", "rejected", "suspended"];
            case "approved":
                return ["rejected", "suspended"];
            case "rejected":
                return ["approved", "suspended"];
            case "suspended":
                return ["approved"];
            default:
                return [];
        }
    };

    const updateStatus = async (id: number, status: Status) => {
        setLoadingId(id);

        await fetch(`http://localhost:5001/api/admin/seller/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        toast.success(`Seller ${status}`);
        setLoadingId(null);
        setReviewSeller(null);
        setVerifiedCheck(false);
        loadSellers();
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={user.full_name || user.email}
                role={user.role}
                isOpen={false}
                onClose={() => { }}
            />

            <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">

                <h1 className="text-2xl font-semibold mb-6">
                    Seller Verification Dashboard
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search sellers..."
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
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatusCard title="Pending" count={countBy("pending")} />
                    <StatusCard title="Approved" count={countBy("approved")} />
                    <StatusCard title="Rejected" count={countBy("rejected")} />
                    <StatusCard title="Suspended" count={countBy("suspended")} />
                </div>

                <div className="bg-white rounded-xl shadow border overflow-hidden">

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Business</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">NGJA No</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">License</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((s) => (
                                <tr key={s.seller_id} className="border-t hover:bg-gray-50">

                                    <td className="p-4 font-medium text-teal-700">
                                        {s.business_name}
                                    </td>

                                    <td className="p-4">{s.email}</td>
                                    <td className="p-4">{s.ngja_registration_no}</td>

                                    <td className="p-4 text-center">
                                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                                            {s.verification_status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center">
                                        {s.seller_license_url ? (
                                            <a
                                                href={`http://localhost:5001${s.seller_license_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-xs"
                                            >
                                                View
                                            </a>
                                        ) : "-"}
                                    </td>

                                    <td className="p-4 text-center space-x-2">
                                        {getAllowedActions(s.verification_status).map((action) => (
                                            <button
                                                key={action}
                                                onClick={() =>
                                                    action === "approved"
                                                        ? setReviewSeller(s)
                                                        : updateStatus(s.seller_id, action)
                                                }
                                                className={`px-3 py-1 text-xs rounded text-white transition
      ${action === "approved" ? "bg-green-600 hover:bg-green-700"
                                                        : action === "rejected" ? "bg-red-600 hover:bg-red-700"
                                                            : "bg-yellow-600 hover:bg-yellow-700"}`}
                                            >
                                                {actionLabels[action]}
                                            </button>
                                        ))}
                                    </td>
                                </tr>
                            ))}

                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-400">
                                        No sellers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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

                {reviewSeller && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white w-[520px] rounded-lg shadow-lg p-6 space-y-4">

                            <h2 className="text-lg font-semibold">
                                Review Seller Documents
                            </h2>

                            <div>
                                <strong>Business:</strong> {reviewSeller.business_name}
                            </div>

                            <div>
                                <strong>Email:</strong> {reviewSeller.email}
                            </div>

                            <div>
                                <strong>NGJA No:</strong> {reviewSeller.ngja_registration_no}
                            </div>

                            <div>
                                <strong>License Preview:</strong>
                                <div className="mt-2">
                                    {reviewSeller.seller_license_url ? (
                                        <iframe
                                            src={`http://localhost:5001${reviewSeller.seller_license_url}`}
                                            className="w-full h-64 border rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-400">
                                            No License Uploaded
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={verifiedCheck}
                                    onChange={() => setVerifiedCheck(!verifiedCheck)}
                                />
                                <span className="text-sm">
                                    I have reviewed and verified the documents
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    disabled={!verifiedCheck}
                                    onClick={() =>
                                        updateStatus(reviewSeller.seller_id, "approved")
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(reviewSeller.seller_id, "rejected")
                                    }
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(reviewSeller.seller_id, "suspended")
                                    }
                                    className="px-4 py-2 bg-yellow-600 text-white rounded"
                                >
                                    Suspend
                                </button>

                                <button
                                    onClick={() => {
                                        setReviewSeller(null);
                                        setVerifiedCheck(false);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function StatusCard({ title, count }: any) {
    return (
        <div className="bg-white p-5 rounded-lg shadow border">
            <h2 className="text-gray-500 text-sm">{title}</h2>
            <p className="text-2xl font-semibold mt-2">{count}</p>
        </div>
    );
}

export default VerifySellers;