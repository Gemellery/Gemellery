import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import {
  ChevronDown,
  Menu,
  Search,
  Eye,
  ExternalLink,
  Calendar,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import API_CONFIG from "../../lib/api.config";
import image from "../../assets/logos/example_ring.png";

interface OrderItem {
  order_item_id: number;
  gem_id: number;
  gem_name: string;
  carat: number;
  cut: string;
  clarity: string;
  color: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

interface StatusHistoryEntry {
  status: string;
  updated_at: string;
}

interface Order {
  order_id: number;
  order_status: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  item_count: number;
  image_url?: string;
}

interface OrderDetails extends Order {
  address_line2?: string;
  country: string;
  phone_number: string;
  full_name: string;
  email: string;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusColors: { [key: string]: string } = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Pending: "bg-gray-100 text-gray-800",
};

const statusIcons: { [key: string]: React.ComponentType<any> } = {
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: X,
  Pending: Clock,
};

function OrderHistory() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch orders
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/buyer/orders/history?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId: number) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/buyer/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch order details");
      const data = await res.json();

      setSelectedOrder(data.order);
      setShowDetails(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load order details");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  // Filter by search term
  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toString().includes(searchTerm) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="p-6 md:p-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Order History</h1>
              <p className="text-gray-600 text-sm">
                Track all your orders and their statuses
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-b p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc000b]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#cc000b]"
              >
                <option value="all">All Orders</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 p-6 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm">
                {orders.length === 0
                  ? "You haven't placed any orders yet"
                  : "No orders match your filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.order_status] || Clock;
                return (
                  <div
                    key={order.order_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left - Order Info */}
                      <div className="flex gap-4 flex-1">
                        <img
                          src={
                            order.image_url
                              ? `${API_CONFIG.BASE_URL}/uploads/gem_images/${order.image_url}`
                              : image
                          }
                          alt="Order"
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = image;
                          }}
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">
                              Order #{order.order_id}
                            </h3>
                            <span
                              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                statusColors[order.order_status] ||
                                statusColors.Pending
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {order.order_status}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {order.city}, {order.state}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle - Items Count & Amount */}
                      <div className="flex flex-col gap-2 md:text-right">
                        <div className="text-sm text-gray-600">
                          {order.item_count} item(s)
                        </div>
                        <div className="text-lg font-bold text-[#cc000b]">
                          PKR {order.total_amount.toLocaleString()}
                        </div>
                      </div>

                      {/* Right - Action Button */}
                      <button
                        onClick={() => fetchOrderDetails(order.order_id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#cc000b] text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold md:w-auto w-full"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg ${
                      page === p
                        ? "bg-[#cc000b] text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                disabled={page === pagination.pages || loading}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order #{selectedOrder.order_id}</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-3">Order Status</h3>
                  <div className="flex items-center gap-3">
                  <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                        statusColors[selectedOrder.order_status]
                      }`}
                    >
                      {statusIcons[selectedOrder.order_status] &&
                        (() => {
                          const IconComponent = statusIcons[selectedOrder.order_status];
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                      {selectedOrder.order_status}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold mb-3">Items ({selectedOrder.items.length})</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.order_item_id}
                        className="flex gap-3 p-3 border rounded-lg"
                      >
                        <img
                          src={
                            item.image_url
                              ? `${API_CONFIG.BASE_URL}/uploads/gem_images/${item.image_url}`
                              : image
                          }
                          alt={item.gem_name}
                          className="w-16 h-16 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = image;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.gem_name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.carat} carat • {item.cut} cut • {item.clarity}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-bold">
                              PKR {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{selectedOrder.full_name}</p>
                    <p>{selectedOrder.address_line1}</p>
                    {selectedOrder.address_line2 && (
                      <p>{selectedOrder.address_line2}</p>
                    )}
                    <p>
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip}
                    </p>
                    <p>{selectedOrder.country}</p>
                    <p className="mt-2">{selectedOrder.phone_number}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>PKR {selectedOrder.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>Payment Method:</span>
                    <span className="font-semibold">{selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold bg-gray-50 p-3 rounded">
                    <span>Total:</span>
                    <span className="text-[#cc000b]">
                      PKR {selectedOrder.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status History */}
                {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-3">Status History</h3>
                    <div className="space-y-2">
                      {selectedOrder.statusHistory.map((history, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#cc000b]" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {history.status}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(history.updated_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderHistory;
