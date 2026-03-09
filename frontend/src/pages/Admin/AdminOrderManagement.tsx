import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Menu } from "lucide-react";

interface Order {
    order_id: number;
    buyer_name: string;
    total_amount: number;
    payment_status: "Pending" | "Paid" | "Failed";
    order_status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    created_at: string;
}

interface OrderItem {
    order_item_id: number;
    quantity: number;
    item_price: number;
    gem_id: number;
    gem_name: string;
    gem_type: string;
    gem_price: number;
    carat: number;
    color: string;
    cut: string;
    clarity: string;
    origin: string;
    description: string;
    gem_status: string;
    images: string[];
}

interface OrderHistory {
    status: string;
    updated_at: string;
}

type OrderStatus = Order["order_status"];
const ROWS_PER_PAGE = 15;

const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
        case "Processing":
            return "bg-yellow-100 text-yellow-800";
        case "Shipped":
            return "bg-blue-100 text-blue-800";
        case "Delivered":
            return "bg-green-100 text-green-800";
        case "Cancelled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

function CountCard({ title, count }: any) {
    return (
        <div className="bg-white p-5 rounded-lg shadow border">
            <h2 className="text-gray-500 text-sm">{title}</h2>
            <p className="text-2xl font-semibold mt-2">{count}</p>
        </div>
    );
}

function AdminOrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                setOrders([]);
                return;
            }

            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setOrders([]);
        }
    };

    const loadOrderDetails = async (id: number) => {
        const res = await fetch(
            `http://localhost:5001/api/admin/orders/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setOrderItems(data.items || []);

        const historyRes = await fetch(
            `http://localhost:5001/api/admin/orders/${id}/history`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const historyData = await historyRes.json();
        setOrderHistory(historyData || []);
    };

    const updateStatus = async (orderId: number, status: OrderStatus) => {
        await fetch(
            `http://localhost:5001/api/admin/orders/${orderId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            }
        );

        loadOrders();
        loadOrderDetails(orderId);
    };

    /* Filtering */
    let filtered = orders.filter(
        (o) =>
            o.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
            o.order_id.toString().includes(search)
    );

    if (statusFilter !== "all") {
        filtered = filtered.filter((o) => o.order_status === statusFilter);
    }

    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const countByStatus = (status: OrderStatus) =>
        orders.filter((o) => o.order_status === status).length;

    const totalRevenue = orders.reduce(
        (sum, o) => sum + Number(o.total_amount),
        0
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar
                adminName={user.full_name || user.email}
                role={user.role}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <div className="flex-1 overflow-y-auto p-6 md:ml-64">
                {/* Mobile Header */}
                <div className="flex items-center gap-4 mb-6 md:hidden">
                    <button onClick={() => setIsOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Order Management
                    </h1>
                </div>

                <div className="hidden md:flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Order Management
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by buyer or order ID..."
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
                            setStatusFilter(e.target.value as any);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <CountCard title="Processing Orders" count={countByStatus("Processing")} />
                    <CountCard title="Shipped Orders" count={countByStatus("Shipped")} />
                    <CountCard title="Delivered Orders" count={countByStatus("Delivered")} />
                    <CountCard title="Total Revenue" count={`$${totalRevenue}`} />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left">Order ID</th>
                                <th className="p-4 text-left">Buyer</th>
                                <th className="p-4 text-center">Total</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Date</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((o) => (
                                <tr key={o.order_id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{o.order_id}</td>
                                    <td className="p-4">{o.buyer_name}</td>
                                    <td className="p-4 text-center">${o.total_amount}</td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                o.order_status
                                            )}`}
                                        >
                                            {o.order_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {new Date(o.created_at).toLocaleDateString("en-GB")}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(o);
                                                loadOrderDetails(o.order_id);
                                            }}
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

                {/* REVIEW MODAL */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white w-[1100px] max-w-[95vw] h-[85vh] rounded-xl shadow-xl flex overflow-hidden">

                            {/* LEFT */}
                            <div className="w-1/2 p-6 overflow-y-auto border-r">
                                <h2 className="text-xl font-semibold mb-6">
                                    Order #{selectedOrder.order_id}
                                </h2>

                                {orderItems.map((item) => (
                                    <div key={item.order_item_id} className="border rounded-lg p-4 mb-4 shadow-sm">
                                        <h3 className="font-semibold text-lg mb-2">
                                            {item.gem_name}
                                        </h3>

                                        <div className="flex gap-2 overflow-x-auto mb-3">
                                            {item.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`http://localhost:5001/uploads/gem_images/${img}`}
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>Carat: {item.carat}</div>
                                            <div>Color: {item.color}</div>
                                            <div>Cut: {item.cut}</div>
                                            <div>Clarity: {item.clarity}</div>
                                            <div>Origin: {item.origin}</div>
                                            <div>Status: {item.gem_status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT */}
                            <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
                                <h3 className="font-semibold mb-4">Status History</h3>

                                {orderHistory.map((h, i) => (
                                    <div key={i} className="mb-3 text-sm">
                                        <div className="font-medium">{h.status}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(h.updated_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}

                                <select
                                    onChange={(e) =>
                                        updateStatus(selectedOrder.order_id, e.target.value as OrderStatus)
                                    }
                                    className="mt-6 px-4 py-2 border rounded w-full"
                                >
                                    <option value="">Update Status</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>

                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="mt-6 w-full px-4 py-2 bg-gray-300 rounded"
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

export default AdminOrderManagement;