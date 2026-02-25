import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboardLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [role, setRole] = useState<"admin" | "super_admin">("admin");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setAdminName(user.full_name || user.email);
    if (user.role) {
      setRole(user.role.toLowerCase() as "admin" | "super_admin");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      <AdminSidebar
        adminName={adminName}
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex-1 flex flex-col ml-0 md:ml-64">

        {/* Top Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="text-sm text-gray-600 capitalize">
            Welcome, {adminName}
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-gray-500 text-sm">Total Sellers</h2>
              <p className="text-3xl font-bold mt-2">120</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-gray-500 text-sm">Pending Verifications</h2>
              <p className="text-3xl font-bold mt-2">8</p>
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-gray-500 text-sm">Total Gems Listed</h2>
              <p className="text-3xl font-bold mt-2">542</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
