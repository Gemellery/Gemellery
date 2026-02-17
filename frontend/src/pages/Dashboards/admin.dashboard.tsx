import React from "react";

const AdminDashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-5 text-2xl font-bold border-b border-gray-700">
                    Gemellery Admin
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block p-2 rounded hover:bg-gray-700">
                        Dashboard
                    </a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-700">
                        Verify Sellers
                    </a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-700">
                        Manage Gems
                    </a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-700">
                        Users
                    </a>
                    <a href="#" className="block p-2 rounded hover:bg-gray-700">
                        Reports
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button className="w-full bg-red-500 hover:bg-red-600 p-2 rounded">
                        Logout
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Top Navbar */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                    <div className="text-sm text-gray-600">
                        Welcome, Admin
                    </div>
                </header>


                {/* Dashboard Content */}
                <main className="p-6 flex-1 overflow-y-auto">

                    {/* Stats Cards */}
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

                    {/* Placeholder Section */}
                    <div className="bg-white mt-8 p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Activity
                        </h2>
                        <p className="text-gray-600">
                            Activity data will appear here...
                        </p>
                    </div>

                </main>
            </div>

        </div>
    );
};

export default AdminDashboardLayout;
