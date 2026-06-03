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

export default function ProfitChart({
  data,
}: {
  data: any[];
}) {

  const formattedData =
    data.map(
      (sale) => ({

        date:
          new Date(
            sale.createdAt
          ).toLocaleDateString(),

        profit:
          sale.profit,
      })
    );

  return (

    <div className="h-[350px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={
            formattedData
          }
        >

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
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={4}
            dot={{
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}