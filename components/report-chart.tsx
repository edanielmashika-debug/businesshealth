"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useTranslation } from "../hooks/useTranslation";

export default function ReportChart({ data }: { data: any[] }) {
  const t = useTranslation();

  return (
    <div
      style={{
        background: "#0f1117",
        borderRadius: 20,
        border: "1px solid #ffffff0d",
        padding: "22px 22px 18px",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#f0f0ff",
            letterSpacing: "-0.02em",
          }}
        >
          {t.reportsPage.analytics}
        </h2>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
          {t.reportsPage.perfomance}
        </p>
      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
              cursor={{ stroke: "#ffffff0a", strokeWidth: 1 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#6b7280", paddingTop: 12 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#a855f7", stroke: "#f0f0ff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#06ffa5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#06ffa5", stroke: "#f0f0ff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
