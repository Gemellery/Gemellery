import { useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import { Plus, Menu, AlignVerticalJustifyEnd, ImageDown, CalendarDays } from "lucide-react";
import image from "../../assets/logos/example_ring.png";

function BuyerDashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <BuyerSidebar
        buyerName={user.full_name || user.email}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200">
            <Menu className="w-5 h-5" />
          </button>

          <div className="ml-4 md:ml-0">
            <h3 className="font-bold text-2xl">Welcome back, {user.full_name}</h3>
            <p className="text-sm text-gray-500">
              Manage your collection, track orders, and design new pieces.
            </p>
          </div>

          <button
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#cc000b]
            text-white font-semibold rounded-full shadow-lg
            hover:scale-105 hover:shadow-xl transition-all duration-300">
            <Plus size={18} /> New AI Design
          </button>
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:gap-4 mb-6">
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <AlignVerticalJustifyEnd />
            <h2 className="font-bold">Active Orders - 10</h2>
          </div>
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <ImageDown />
            <h2 className="font-bold">Saved Designs - 10</h2>
          </div>
          <div className="w-full md:flex-1 h-32 bg-[#f8f0d9] rounded-xl flex flex-col items-center justify-center gap-2">
            <CalendarDays />
            <h2 className="font-bold">Upcoming Appointments - 10</h2>
          </div>
        </div>
        
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4 underline">Recent Orders</h3>
          <div className="flex flex-col gap-4">
            <div className="w-full h-24 bg-white rounded-xl shadow flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt="Order"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <span className="font-semibold">Order #12345</span>
              </div>
              <span className="text-sm text-gray-500">Status: Shipped</span>
            </div>

            <div className="w-full h-24 bg-white rounded-xl shadow flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt="Order"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <span className="font-semibold">Order #12345</span>
              </div>
              <span className="text-sm text-gray-500">Status: Shipped</span>
            </div>
            <div className="w-full h-24 bg-white rounded-xl shadow flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt="Order"
                  className="w-12 h-12 rounded-md object-cover"
                />
                <span className="font-semibold">Order #12345</span>
              </div>
              <span className="text-sm text-gray-500">Status: Shipped</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default BuyerDashboardLayout;
