"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  useExpenseStore,
} from "@/store/expense-store";

export default function CategoryChart() {

  const expenses =
    useExpenseStore(
      (state) =>
        state.expenses
    );

  const categoryTotals:
    Record<string, number> = {};

  expenses.forEach(
    (expense) => {

      if (
        categoryTotals[
          expense.category
        ]
      ) {

        categoryTotals[
          expense.category
        ] += expense.amount;

      } else {

        categoryTotals[
          expense.category
        ] = expense.amount;
      }
    }
  );

  const data =
    Object.entries(
      categoryTotals
    ).map(
      ([name, amount]) => ({
        name,
        amount,
      })
    );

  return (

    <div className="h-[380px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="name"
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

          <Bar
            dataKey="amount"
            fill="#ef4444"
            radius={[
              14,
              14,
              0,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
