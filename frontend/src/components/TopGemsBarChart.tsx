import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopGem } from "../pages/seller/SellerAnalytics";

interface Props {
  data: TopGem[];
}

export const TopGemsBarChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-80 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Top Gems by Revenue
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#6366f1" name="Revenue (LKR)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
