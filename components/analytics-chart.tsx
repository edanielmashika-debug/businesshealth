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

    <div className="h-[380px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >

          <defs>

            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#06b6d4"
                stopOpacity={0.5}
              />

              <stop
                offset="95%"
                stopColor="#06b6d4"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background:
                "#0f172a",
              border:
                "1px solid #1e293b",
              borderRadius:
                "16px",
              color:
                "white",
            }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#06b6d4"
            strokeWidth={4}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
