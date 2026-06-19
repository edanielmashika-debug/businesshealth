"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useExpenseStore } from "@/store/expense-store";

const COLORS = ["#7c3aed", "#a855f7", "#c084fc", "#8b5cf6", "#6d28d9", "#4c1d95"];

export default function CategoryChart() {
  const expenses = useExpenseStore((state) => state.expenses);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  const data = Object.entries(categoryTotals).map(([name, amount]) => ({ name, amount }));

  return (
    <div style={{ height: 320, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="1 6" stroke="#ffffff07" vertical={false} />
          <XAxis
            dataKey="name"
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
            cursor={{ fill: "#7c3aed0a" }}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
