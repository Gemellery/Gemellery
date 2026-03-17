import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import Footer from "../../components/BasicFooter";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import API_CONFIG from "../../lib/api.config";

interface Order {
  order_id: number;
  total_amount: number;
  status?: string;
  order_status?: string;
  created_at: string;
  shipping_address: string;
  city: string;
  state: string;
  zip: string;
  item_count: number;
  image_url?: string;
  gem_name?: string;
}

function BuyerOrderStatus() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/buyer/orders/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      
      const data = await response.json();
      
      // Filter primarily for "active" statuses. 
      // Modify mapping here depending on how your backend strictly defines of order_status
      const ordersList = Array.isArray(data) ? data : (data.orders || []);
      
      const active = ordersList.filter((o: Order) => {
        const currentStatus = o.status || o.order_status;
        return currentStatus && ["pending", "processing", "shipped", "delivered"].includes(currentStatus.toLowerCase());
      });
      
      setActiveOrders(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return 1;
      case "processing": return 2;
      case "shipped": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <BuyerSidebar
          buyerName={user.full_name || user.email}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full">
          {/* Header */}
          <div className="bg-white shadow-sm sticky top-0 z-50">
            <div className="px-6 py-5 md:px-10 md:py-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Order Status</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Track the delivery progress of your ongoing purchases
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm mt-10">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Shipments</h3>
                <p className="text-gray-500">
                  You don't have any orders currently processing or out for delivery.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeOrders.map((order) => {
                  const currentStep = getStepProgress(order.status || order.order_status || "");
                  
                  return (
                    <div key={order.order_id} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {order.gem_name || `Order #${order.order_id}`}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span>Placed: {new Date(order.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Order #{order.order_id}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-[#cc000b]">
                            LKR {Number(order.total_amount).toLocaleString('en-US')}
                          </p>
                          <p className="text-sm text-gray-500">{order.item_count} item(s)</p>
                        </div>
                      </div>

                      {/* Stepper Timeline */}
                      <div className="relative">
                        {/* Connecting Line Tracker */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block">
                           <div 
                             className="h-full bg-blue-600 rounded-full transition-all duration-500"
                             style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                           />
                        </div>

                        <div className="relative flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
                          {/* Step 1: Received / Pending */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="sm:text-center">
                              <p className={`font-bold text-sm ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Order Received</p>
                            </div>
                          </div>

                          {/* Step 2: Processing */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="sm:text-center">
                              <p className={`font-bold text-sm ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Processing</p>
                            </div>
                          </div>

                          {/* Step 3: Shipped */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <Truck className="w-4 h-4" />
                            </div>
                            <div className="sm:text-center">
                              <p className={`font-bold text-sm ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</p>
                              {currentStep >= 3 && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{order.city}, {order.state}</p>
                              )}
                            </div>
                          </div>

                          {/* Step 4: Delivered */}
                          <div className="flex sm:flex-col items-center gap-4 sm:gap-2 relative z-10 w-full sm:w-1/4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${currentStep >= 4 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div className="sm:text-center">
                              <p className={`font-bold text-sm ${currentStep >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default BuyerOrderStatus;
