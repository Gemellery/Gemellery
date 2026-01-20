import { useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import { Plus, Menu, AlignVerticalJustifyEnd, ImageDown, CalendarDays, Heart, ArrowRight } from "lucide-react";
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

        {/* Recent order section */}
        <div className="mt-10">
          <h3 className="flex items-center text-lg font-bold underline">
            Recent Orders <ArrowRight className="ml-2" />
          </h3>
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

        {/* Wishlist */}
        <h3 className="flex items-center text-lg font-bold underline mt-10">
          Wish List <ArrowRight className="ml-2" />
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6 mt-6">
          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <div className="relative">
              <div className="rounded-2xl p-2">
                <img
                  src="/sample_gems/alexandrite_18.jpg"
                  alt="Pink Tourmaline"
                  className="w-full h-48 object-contain rounded-xl"
                />
              </div>
              <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                <Heart className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-semibold text-sm text-gray-900">
                Pink Tourmaline
              </h3>
              <p className="text-xs text-gray-500">
                1.2 ct • Cushion
              </p>
              <p className="font-bold text-red-500">
                $1,200
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <div className="relative">
              <div className="rounded-2xl p-2">
                <img
                  src="/sample_gems/sapphire blue_6.jpg"
                  alt="Pink Tourmaline"
                  className="w-full h-48 object-contain rounded-xl"
                />
              </div>
              <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                <Heart className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-semibold text-sm text-gray-900">
                Pink Tourmaline
              </h3>
              <p className="text-xs text-gray-500">
                1.2 ct • Cushion
              </p>
              <p className="font-bold text-red-500">
                $1,200
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <div className="relative">
              <div className="rounded-2xl p-2">
                <img
                  src="/sample_gems/sapphire blue_6.jpg"
                  alt="Pink Tourmaline"
                  className="w-full h-48 object-contain rounded-xl"
                />
              </div>
              <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                <Heart className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-semibold text-sm text-gray-900">
                Pink Tourmaline
              </h3>
              <p className="text-xs text-gray-500">
                1.2 ct • Cushion
              </p>
              <p className="font-bold text-red-500">
                $1,200
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <div className="relative">
              <div className="rounded-2xl p-2">
                <img
                  src="/sample_gems/sapphire blue_6.jpg"
                  alt="Pink Tourmaline"
                  className="w-full h-48 object-contain rounded-xl"
                />
              </div>
              <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow">
                <Heart className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-semibold text-sm text-gray-900">
                Pink Tourmaline
              </h3>
              <p className="text-xs text-gray-500">
                1.2 ct • Cushion
              </p>
              <p className="font-bold text-red-500">
                $1,200
              </p>
            </div>
          </div>
        </div>

        {/* AI Designs */}
        <h3 className="flex items-center text-lg font-bold underline mt-10">
          Your AI Designs <ArrowRight className="ml-2" />
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-6 mt-6">
          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>

          <div className="rounded-2xl border border-[#e9dfc8] bg-white p-3">
            <img
              src="/sample_gems/almandine_18.jpg"
              alt="AI Design"
              className="h-40 w-full object-contain rounded-xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default BuyerDashboardLayout;
