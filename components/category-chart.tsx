"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  useExpenseStore,
} from "@/store/expense-store";

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#8b5cf6",
  "#10b981",
  "#f97316",
  "#ef4444",
];

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
      ([name, value]) => ({
        name,
        value,
      })
    );

  return (

    <div className="h-[350px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >

            {data.map(
              (
                entry,
                index
              ) => (

                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[
                    index %
                    COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}