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

    <div className="h-[350px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Bar
            dataKey="amount"
            fill="#ef4444"
            radius={[
              10,
              10,
              0,
              0,
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}