"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ProfitChart({ data }: { data: any[] }) {
  const formattedData = data.map((sale) => ({
    date: new Date(sale.createdAt).toLocaleDateString(),
    profit: sale.profit,
  }));

  return (
    <div style={{ height: 300, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              border: "1px solid #06ffa522",
              borderRadius: 12,
              color: "#f0f0ff",
              fontSize: 12,
              boxShadow: "0 8px 32px #00000044",
            }}
            cursor={{ stroke: "#06ffa522", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#06ffa5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "#06ffa5", stroke: "#f0f0ff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
