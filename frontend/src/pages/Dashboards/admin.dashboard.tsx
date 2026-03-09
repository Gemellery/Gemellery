import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import AdminStatCards from "../../components/AdminStatsCards";
import AdminOverviewSection from "../../components/AdminOverviewSection";
import AdminInsightsSection from "../../components/AdminInsightsSection";
// import AdminLiveActivityFeed from "../../components/AdminLiveActivityFeed";
import Footer from "../../components/BasicFooter";
import AdminRecentOrdersAndApprovals from "../../components/AdminRecentOrdersAndApprovals";
import AdminTopSellers from "../../components/AdminTopSellers";
import AdminQuickActions from "../../components/AdminQuickActions";

const AdminDashboardLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");

  const navigate = useNavigate();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setAdminName(user.full_name || user.email);

    if (user.role) {
      setRole(user.role.toLowerCase() as "admin" | "super_admin");
    }

    fetchDashboardStats();

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGems: 0,
    pendingVerifications: 0,
    pendingGemApprovals: 0,
    totalOrders: 0,
  });

  const fetchDashboardStats = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/admin/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setStats(data);

    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar
        adminName={adminName}
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">

        {/* Navbar */}
        <AdminNavbar
          adminName={adminName}
          onOpenSidebar={() => setIsOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-y-auto">

          <AdminStatCards
            totalUsers={stats.totalUsers}
            totalGems={stats.totalGems}
            pendingVerifications={stats.pendingVerifications}
            pendingGemApprovals={stats.pendingGemApprovals}
            totalOrders={stats.totalOrders}
          />

          {/* Admin shortcuts */}
          <AdminQuickActions />

          {/* Platform trends */}
          <AdminOverviewSection />

          {/* Marketplace insights */}
          <AdminInsightsSection />

          {/* Operational monitoring */}
          <AdminRecentOrdersAndApprovals />

          {/* Performance highlights */}
          <AdminTopSellers />

          <Footer />

        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;