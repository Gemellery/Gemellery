import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed sidebar on the left */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <SellerSidebar
          sellerName="Seller Dashboard"
          isOpen={true}
          onClose={() => {}}
        />
      </div>

      <main className="ml-64 flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Seller Analytics
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Monitor your performance, trends, and best‑selling gems.
        </p>

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
      </main>
    </div>
  );
};

export default SellerAnalyticsPage;
