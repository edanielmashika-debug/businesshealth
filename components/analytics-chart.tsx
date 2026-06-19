"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/hooks/useTranslation";
import { useSalesStore } from "@/store/sales-store";

export default function AnalyticsChart() {
  const t = useTranslation();
  const sales = useSalesStore((state) => state.sales);

  const groupedSales: Record<string, number> = {};
  sales.forEach((sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    groupedSales[date] = (groupedSales[date] || 0) + sale.total;
  });
  const data = Object.entries(groupedSales).map(([date, revenue]) => ({ date, revenue }));

  return (
    <div style={{ height: 320, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradientNova" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 6" stroke="#ffffff07" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#374151"
            tick={{ fill: "#4b5563", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#374151"
            tick={{ fill: "#4b5563", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#161822",
              border: "1px solid #7c3aed33",
              borderRadius: 12,
              color: "#f0f0ff",
              fontSize: 12,
              boxShadow: "0 8px 32px #00000044",
            }}
            cursor={{ stroke: "#7c3aed33", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#revenueGradientNova)"
            dot={false}
            activeDot={{ r: 5, fill: "#a855f7", stroke: "#f0f0ff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
