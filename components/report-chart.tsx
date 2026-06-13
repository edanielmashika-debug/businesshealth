"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "../hooks/useTranslation";

export default function ReportChart({
  data,
}: {
  data: any[];
}) {

  const t = useTranslation();

  return (

    <div className="bg-white rounded-3xl border p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-black">
          {t.reportsPage.analytics}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {t.reportsPage.perfomance}
        </p>
      </div>

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={4}
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#06b6d4"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}