import React from "react";
import type { SellerKpi } from "../pages/seller/SellerAnalytics";

interface Props {
  kpis: SellerKpi[];
}

const getTrendColor = (trend?: "up" | "down" | "neutral") => {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-gray-500";
};

const getTrendLabel = (trend?: "up" | "down" | "neutral") => {
  if (trend === "up") return "▲ Improving";
  if (trend === "down") return "▼ Decreasing";
  return "▬ Stable";
};

export const SellerAnalyticsKpiCards: React.FC<Props> = ({ kpis }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {kpi.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {typeof kpi.value === "number"
              ? kpi.value.toLocaleString("en-LK")
              : kpi.value}
          </p>
          {kpi.trend && (
            <p className={`mt-1 text-xs ${getTrendColor(kpi.trend)}`}>
              {getTrendLabel(kpi.trend)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
