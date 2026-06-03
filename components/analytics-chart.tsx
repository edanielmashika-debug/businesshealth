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

import {
  useSalesStore,
} from "@/store/sales-store";

export default function AnalyticsChart() {

  const sales =
    useSalesStore(
      (state) =>
        state.sales
    );

  const groupedSales:
    Record<
      string,
      number
    > = {};

  sales.forEach(
    (sale) => {

      const date =
        new Date(
          sale.createdAt
        ).toLocaleDateString();

      if (
        groupedSales[date]
      ) {

        groupedSales[
          date
        ] += sale.total;

      } else {

        groupedSales[
          date
        ] = sale.total;
      }
    }
  );

  const data =
    Object.entries(
      groupedSales
    ).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );

  return (

    <div className="h-[350px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={data}
        >

          <defs>

            <linearGradient
              id="colorRevenue"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#3b82f6"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="#3b82f6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

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

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}