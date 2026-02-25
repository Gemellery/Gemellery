import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";
import AdminStatCards from "../../components/AdminStatsCards";
import AdminOverviewSection from "../../components/AdminOverviewSection";
import AdminInsightsSection from "../../components/AdminInsightsSection"; 
import AdminLiveActivityFeed from "../../components/AdminLiveActivityFeed";
import Footer from "../../components/BasicFooter";

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
            totalUsers={350}
            totalGems={542}
            pendingVerifications={8}
            pendingGemApprovals={5}
            totalOrders={78}
          />

          <AdminOverviewSection />

          <AdminInsightsSection />

          <AdminLiveActivityFeed />

          <Footer/>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;