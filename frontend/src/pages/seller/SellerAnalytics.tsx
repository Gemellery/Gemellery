import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import { Menu } from "lucide-react";
import Footer from "../../components/BasicFooter";
import { SellerAnalyticsKpiCards } from "../../components/SellerAnalyticsKpiCards";
import { SellerSalesChart } from "../../components/SellerSalesChart";
import { TopGemsBarChart } from "../../components/TopGemsBarChart";
import API_CONFIG from "../../lib/api.config";

export interface SellerKpi {
  label: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
}

export interface SalesPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface TopGem {
  name: string;
  revenue: number;
}

export interface SellerAnalyticsData {
  kpis: SellerKpi[];
  salesOverTime: SalesPoint[];
  topGems: TopGem[];
}

const SellerAnalyticsPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<SellerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/seller/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const json: SellerAnalyticsData = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SellerSidebar
        sellerName={user?.full_name || user?.email || "Seller Dashboard"}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="flex items-start md:items-center mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 mr-3 rounded-lg hover:bg-gray-200 text-gray-600 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor your performance, trends, and best‑selling gems.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading analytics...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : !data ? (
          <p className="text-sm text-gray-500">No analytics data available.</p>
        ) : (
          <div className="space-y-6">
            <SellerAnalyticsKpiCards kpis={data.kpis} />

            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
              <SellerSalesChart data={data.salesOverTime} />
              <TopGemsBarChart data={data.topGems} />
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default SellerAnalyticsPage;
