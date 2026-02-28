import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SalesPoint } from "../pages/seller/SellerAnalytics";

interface Props {
  data: SalesPoint[];
}

export const SellerSalesChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-80 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Sales & Orders (Last 7 days)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            name="Sales (LKR)"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#22c55e"
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
