import { useState } from "react";
import { Menu } from "lucide-react";

import {
  DollarSign,
  TrendingUp,
  Store,
  Users,
  Package,
  Star,
} from "lucide-react";

import AdminSidebar from "../../components/AdminSidebar";
import ReportCard from "../../components/admin/ReportCard";
import ReportModal from "../../components/admin/ReportModal";

export type ReportType =
  | "sales"
  | "top_gems"
  | "seller_performance"
  | "user_activity"
  | "order_status"
  | "seller_ratings";

const reports = [
  {
    id: "sales",
    title: "Sales",
    description: "Total sales",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "top_gems",
    title: "Top Selling Gems",
    description: "Most purchased gemstones",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "seller_performance",
    title: "Seller Performance",
    description: "Seller revenue and performance",
    icon: Store,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "user_activity",
    title: "User Activity",
    description: "User registrations and activity",
    icon: Users,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "order_status",
    title: "Order Status",
    description: "Orders by status",
    icon: Package,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "seller_ratings",
    title: "Seller Ratings",
    description: "Top rated sellers",
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
  },
];

function ReportsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeReport, setActiveReport] =
    useState<ReportType | null>(null);

  const storedUser = localStorage.getItem("user");
  const loggedUser = storedUser ? JSON.parse(storedUser) : null;

  const adminName = loggedUser?.full_name || "Admin";
  const role = loggedUser?.role || "admin";

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}

      <AdminSidebar
        adminName={adminName}
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Page Content */}

      <div className="flex-1 overflow-y-auto p-6 md:ml-64">

        {/* Mobile Header */}

        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-semibold">
            Reports & Analytics
          </h1>
        </div>

        {/* Desktop Header */}

        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Reports & Analytics
          </h1>
        </div>

        {/* Report Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {reports.map((report) => (
            <ReportCard
              key={report.id}
              title={report.title}
              description={report.description}
              icon={report.icon}
              color={report.color}
              onClick={() =>
                setActiveReport(report.id as ReportType)
              }
            />
          ))}

        </div>

        {/* Modal */}

        {activeReport && (
          <ReportModal
            reportType={activeReport}
            onClose={() => setActiveReport(null)}
          />
        )}

      </div>
    </div>
  );
}

export default ReportsPage;