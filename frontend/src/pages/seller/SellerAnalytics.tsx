import React, { useEffect, useState } from "react";
import SellerSidebar from "../../components/SellerSidebar";
import { SellerAnalyticsKpiCards } from "../../components/SellerAnalyticsKpiCards";
import { SellerSalesChart } from "../../components/SellerSalesChart";
import { TopGemsBarChart } from "../../components/TopGemsBarChart";

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

  useEffect(() => {
    const mock: SellerAnalyticsData = {
      kpis: [
        { label: "Total Revenue (LKR)", value: 1250000, trend: "up" },
        { label: "Orders This Month", value: 48, trend: "up" },
        { label: "Average Order Value (LKR)", value: 26000, trend: "neutral" },
        { label: "Refund Rate", value: "1.2%", trend: "down" },
      ],
      salesOverTime: [
        { date: "Mon", sales: 120000, orders: 8 },
        { date: "Tue", sales: 180000, orders: 12 },
        { date: "Wed", sales: 90000, orders: 6 },
        { date: "Thu", sales: 200000, orders: 14 },
        { date: "Fri", sales: 160000, orders: 10 },
        { date: "Sat", sales: 220000, orders: 15 },
        { date: "Sun", sales: 155000, orders: 11 },
      ],
      topGems: [
        { name: "Blue Sapphire 5ct", revenue: 450000 },
        { name: "Ruby 3ct", revenue: 320000 },
        { name: "Alexandrite 2ct", revenue: 210000 },
      ],
    };

    setTimeout(() => {
      setData(mock);
      setLoading(false);
    }, 300);
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

        {loading || !data ? (
          <p className="text-sm text-gray-500">Loading analytics...</p>
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
