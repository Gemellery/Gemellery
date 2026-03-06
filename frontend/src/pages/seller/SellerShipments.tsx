import { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import { Menu, Package, Truck, CheckCircle2, Clock, Eye, X } from "lucide-react";
import API_CONFIG from "../../lib/api.config";

interface OrderItem {
  order_item_id: number;
  order_id: number;
  gem_name: string;
  gem_type: string;
  color: string;
  quantity: number;
  price: string;
  image_url: string | null;
}

interface SellerOrder {
  order_id: number;
  order_status: string;
  payment_status: string;
  total_amount: string;
  created_at: string;
  buyer_name: string;
  buyer_email: string;
  ship_first_name: string | null;
  ship_last_name: string | null;
  ship_street: string | null;
  ship_city: string | null;
  ship_country: string | null;
  ship_postal_code: string | null;
  shipment_id: number | null;
  tracking_no: string | null;
  carrier: string | null;
  shipment_status: string | null;
  shipped_date: string | null;
  delivered_date: string | null;
  items: OrderItem[];
}

const statusStyles: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
};

const shipmentStatusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
};

export default function SellerShipments() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [trackingNo, setTrackingNo] = useState("");
  const [carrier, setCarrier] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      setOrders(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    // Filter by status
    if (filter !== "all" && o.order_status !== filter) return false;
    // Filter by search
    if (search.trim()) {
      const searchLower = search.trim().toLowerCase();
      const matchesBuyer = o.buyer_name?.toLowerCase().includes(searchLower);
      const matchesOrderId = o.order_id.toString().includes(searchLower);
      const matchesTracking = o.tracking_no?.toLowerCase().includes(searchLower);
      return matchesBuyer || matchesOrderId || matchesTracking;
    }
    return true;
  });

  const openShipmentModal = (order: SellerOrder) => {
    setSelectedOrder(order);
    setTrackingNo(order.tracking_no || "");
    setCarrier(order.carrier || "");
  };

  const handleSaveShipment = async () => {
    if (!selectedOrder || !trackingNo.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/seller/orders/${selectedOrder.order_id}/shipment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tracking_no: trackingNo.trim(), carrier: carrier.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/seller/orders/${orderId}/shipment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "delivered" }),
        }
      );
      if (!res.ok) throw new Error("Failed to update");
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const counts = {
    all: orders.length,
    Processing: orders.filter((o) => o.order_status === "Processing").length,
    Shipped: orders.filter((o) => o.order_status === "Shipped").length,
    Delivered: orders.filter((o) => o.order_status === "Delivered").length,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SellerSidebar
        sellerName={user?.full_name || user?.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-6 md:p-8 bg-gray-50">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-4 md:ml-0">
            <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
            <p className="text-sm text-gray-500">Manage orders and shipment tracking</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by buyer, order ID, or tracking number"
            className="w-full md:w-96 px-4 py-2 border border-[#16635d] rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#16635d] focus:border-[#16635d] focus:shadow-[0_0_0_1.5px_#16635d] transition-shadow text-sm"
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            icon={<Package className="w-5 h-5 text-gray-600" />}
            label="Total Orders"
            value={counts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <SummaryCard
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            label="Processing"
            value={counts.Processing}
            active={filter === "Processing"}
            onClick={() => setFilter("Processing")}
          />
          <SummaryCard
            icon={<Truck className="w-5 h-5 text-blue-600" />}
            label="Shipped"
            value={counts.Shipped}
            active={filter === "Shipped"}
            onClick={() => setFilter("Shipped")}
          />
          <SummaryCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
            label="Delivered"
            value={counts.Delivered}
            active={filter === "Delivered"}
            onClick={() => setFilter("Delivered")}
          />
        </div>

        {/* Orders Table */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Buyer</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Tracking</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">#{order.order_id}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{order.buyer_name}</div>
                        <div className="text-xs text-gray-400">{order.buyer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {order.items.map((item) => (
                          <div key={item.order_item_id} className="text-xs">
                            {item.gem_name} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        LKR {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusStyles[order.order_status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.order_status}
                        </span>
                        {order.shipment_status && (
                          <span
                            className={`inline-block ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              shipmentStatusStyles[order.shipment_status] || ""
                            }`}
                          >
                            {order.shipment_status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {order.tracking_no ? (
                          <div>
                            <div className="font-medium">{order.tracking_no}</div>
                            {order.carrier && (
                              <div className="text-gray-400">{order.carrier}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {order.order_status === "Processing" && (
                            <button
                              onClick={() => openShipmentModal(order)}
                              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Add Tracking
                            </button>
                          )}
                          {order.order_status === "Shipped" && (
                            <>
                              <button
                                onClick={() => openShipmentModal(order)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 rounded"
                                title="Edit tracking"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMarkDelivered(order.order_id)}
                                className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                Mark Delivered
                              </button>
                            </>
                          )}
                          {order.order_status === "Delivered" && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Shipment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Shipment — Order #{selectedOrder.order_id}
              </h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Shipping Address */}
            {selectedOrder.ship_street && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-700 mb-1">Ship to:</p>
                <p>
                  {selectedOrder.ship_first_name} {selectedOrder.ship_last_name}
                </p>
                <p>{selectedOrder.ship_street}</p>
                <p>
                  {selectedOrder.ship_city}, {selectedOrder.ship_country}{" "}
                  {selectedOrder.ship_postal_code}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="e.g. LK123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="e.g. DHL, FedEx, Sri Lanka Post"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveShipment}
                  disabled={saving || !trackingNo.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Shipment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
        active
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {icon}
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </button>
  );
}
