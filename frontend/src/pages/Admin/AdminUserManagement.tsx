import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import toast from "react-hot-toast";

interface User {
    user_id: number;
    email: string;
    full_name: string;
    mobile: string;
    role: "Buyer" | "Seller";
    status: "active" | "inactive" | "frozen";
    joined_date: string | null;
    country_name: string;
    orders_placed: number;
    orders_received: number;

    business_name?: string;
    ngja_registration_no?: string;
    seller_verification_status?: "pending" | "approved" | "rejected" | "suspended";
    seller_license_url?: string;
}

type Status = User["status"];
const ROWS_PER_PAGE = 15;

// Status style

const getStatusStyle = (status: Status) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-gray-200 text-gray-700";
        case "frozen":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

// Count card

function CountCard({ title, count }: any) {
    return (
        <div className="bg-white p-5 rounded-lg shadow border">
            <h2 className="text-gray-500 text-sm">{title}</h2>
            <p className="text-2xl font-semibold mt-2">{count}</p>
        </div>
    );
}

function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewUser, setReviewUser] = useState<User | null>(null);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [confirmAction, setConfirmAction] = useState<{
        userId: number;
        status: Status;
    } | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await fetch("http://localhost:5001/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();

        const onlyUsers = data.filter(
            (u: User) => u.role === "Buyer" || u.role === "Seller"
        );

        setUsers(onlyUsers);
    };

    // Filtering

    let filtered = users.filter(
        (u) =>
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
        filtered = filtered.filter((u) => u.status === statusFilter);
    }

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    // Counts

    const countByStatus = (status: Status) =>
        users.filter((u) => u.status === status).length;

    const totalBuyers = users.filter((u) => u.role === "Buyer").length;
    const totalSellers = users.filter((u) => u.role === "Seller").length;

    // Status update

    const updateStatus = async (id: number, newStatus: Status) => {
        const res = await fetch(
            `http://localhost:5001/api/admin/users/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            }
        );

        if (!res.ok) {
            toast.error("Failed to update status");
            return;
        }

        toast.success("User status updated");
        loadUsers();
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
                    User Management Dashboard
                </h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search users..."
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
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="frozen">Freezed</option>
                    </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <CountCard title="Total Buyers" count={totalBuyers} />
                    <CountCard title="Total Sellers" count={totalSellers} />
                    <CountCard title="Active Users" count={countByStatus("active")} />
                    <CountCard title="Suspended Users" count={countByStatus("frozen")} />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-center">Role</th>
                                <th className="p-4 text-center">Joined</th>
                                <th className="p-4 text-left">Country</th>
                                <th className="p-4 text-center">Orders</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginated.map((u) => (
                                <tr
                                    key={u.user_id}
                                    className={`border-t ${u.role === "Buyer"
                                        ? "bg-blue-50"
                                        : "bg-rose-50"
                                        }`}
                                >
                                    <td className="p-4 font-medium">{u.full_name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4 text-center">{u.role}</td>
                                    <td className="p-4 text-center">
                                        {u.joined_date
                                            ? new Date(u.joined_date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>
                                    <td className="p-4">{u.country_name || "-"}</td>
                                    <td className="p-4 text-center">
                                        {u.role === "Buyer"
                                            ? u.orders_placed
                                            : u.orders_received}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                u.status
                                            )}`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center space-x-2">
                                        <button
                                            onClick={() => setReviewUser(u)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
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

                {/* Review */}

                {reviewUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white w-[1000px] max-w-[95vw] h-[85vh] rounded-xl shadow-xl flex overflow-hidden">

                            {/* LEFT  */}
                            <div className="w-1/2 p-6 overflow-y-auto border-r">
                                <h2 className="text-xl font-semibold mb-6">
                                    {reviewUser.role === "Buyer"
                                        ? "Buyer Review Panel"
                                        : "Seller Review Panel"}
                                </h2>

                                {/* BASIC INFO */}
                                <div className="space-y-3 text-sm">
                                    <div><strong>Name:</strong> {reviewUser.full_name}</div>
                                    <div><strong>Email:</strong> {reviewUser.email}</div>
                                    <div><strong>Mobile:</strong> {reviewUser.mobile || "-"}</div>
                                    <div><strong>Country:</strong> {reviewUser.country_name || "-"}</div>
                                    <div>
                                        <strong>Joined:</strong>{" "}
                                        {reviewUser.joined_date
                                            ? new Date(reviewUser.joined_date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </div>
                                    <div>
                                        <strong>Account Status:</strong>{" "}
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(reviewUser.status)}`}>
                                            {reviewUser.status}
                                        </span>
                                    </div>
                                </div>

                                {/* BUYER */}
                                {reviewUser.role === "Buyer" && (
                                    <div className="mt-6 border-t pt-4">
                                        <h3 className="font-semibold text-sm text-gray-600 mb-3">
                                            Buyer Activity
                                        </h3>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Total Orders Placed:</strong>{" "}
                                                {reviewUser.orders_placed}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SELLER */}
                                {reviewUser.role === "Seller" && (
                                    <div className="mt-6 border-t pt-4">
                                        <h3 className="font-semibold text-sm text-gray-600 mb-3">
                                            Seller Details
                                        </h3>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Business Name:</strong>{" "}
                                                {reviewUser.business_name || "-"}
                                            </div>

                                            <div>
                                                <strong>NGJA Registration No:</strong>{" "}
                                                {reviewUser.ngja_registration_no || "-"}
                                            </div>

                                            <div>
                                                <strong>Verification Status:</strong>{" "}
                                                {reviewUser.seller_verification_status || "Not Available"}
                                            </div>

                                            <div>
                                                <strong>Total Orders Received:</strong>{" "}
                                                {reviewUser.orders_received}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                window.open("/admin/verify-sellers", "_blank")
                                            }
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-xs"
                                        >
                                            Open Seller Verification Panel
                                        </button>
                                    </div>
                                )}

                                {/* ACCOUNT ACTIONS */}

                                <div className="flex gap-3 mt-8">

                                    {/* Buyer-only controls */}
                                    {reviewUser.role === "Buyer" && (
                                        <>
                                            {reviewUser.status !== "active" && (
                                                <button
                                                    onClick={() =>
                                                        setConfirmAction({
                                                            userId: reviewUser.user_id,
                                                            status: "active",
                                                        })
                                                    }
                                                    className="px-5 py-2 bg-green-600 text-white rounded"
                                                >
                                                    Activate Account
                                                </button>
                                            )}

                                            {reviewUser.status !== "inactive" && (
                                                <button
                                                    onClick={() =>
                                                        setConfirmAction({
                                                            userId: reviewUser.user_id,
                                                            status: "inactive",
                                                        })
                                                    }
                                                    className="px-5 py-2 bg-red-600 text-white rounded"
                                                >
                                                    Deactivate Account
                                                </button>
                                            )}

                                            {reviewUser.status !== "frozen" && (
                                                <button
                                                    onClick={() =>
                                                        setConfirmAction({
                                                            userId: reviewUser.user_id,
                                                            status: "frozen",
                                                        })
                                                    }
                                                    className="px-5 py-2 bg-yellow-600 text-white rounded"
                                                >
                                                    Freeze Account
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <button
                                        onClick={() => setReviewUser(null)}
                                        className="px-5 py-2 bg-gray-300 rounded"
                                    >
                                        Close
                                    </button>

                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="w-1/2 bg-gray-50 p-6 flex flex-col">
                                {reviewUser.role === "Buyer" && (
                                    <>
                                        <h3 className="text-sm font-medium mb-4">
                                            Buyer Summary
                                        </h3>

                                        <div className="bg-white border rounded p-6 text-center">
                                            <p className="text-sm mb-2">
                                                Orders Placed
                                            </p>

                                            <p className="text-4xl font-bold text-blue-600">
                                                {reviewUser.orders_placed}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {reviewUser.role === "Seller" && (
                                    <>
                                        <h3 className="text-sm font-medium mb-4">
                                            Seller Activity & License
                                        </h3>

                                        <div className="bg-white border rounded p-4 mb-4 text-center">
                                            <p className="text-sm mb-2">
                                                Orders Received
                                            </p>

                                            <p className="text-3xl font-bold text-rose-600">
                                                {reviewUser.orders_received}
                                            </p>
                                        </div>

                                        {reviewUser.seller_license_url && (
                                            <div className="flex-1 border rounded bg-white overflow-hidden">
                                                <iframe
                                                    src={`http://localhost:5001${reviewUser.seller_license_url}`}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )}
                {confirmAction && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
                        <div className="bg-white w-[400px] rounded-xl shadow-2xl p-6 animate-fadeIn">

                            <h3 className="text-lg font-semibold mb-3">
                                Confirm Action
                            </h3>

                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to{" "}
                                <span className="font-semibold capitalize">
                                    {confirmAction.status}
                                </span>{" "}
                                this account?
                            </p>

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        await updateStatus(
                                            confirmAction.userId,
                                            confirmAction.status
                                        );
                                        setConfirmAction(null);
                                        setReviewUser(null);
                                    }}
                                    className={`px-4 py-2 text-white rounded ${confirmAction.status === "active"
                                        ? "bg-green-600"
                                        : confirmAction.status === "inactive"
                                            ? "bg-yellow-600"
                                            : "bg-red-600"
                                        }`}
                                >
                                    Confirm
                                </button>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUserManagement;