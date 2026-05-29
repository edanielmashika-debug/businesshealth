"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    name: string;
    revenue: number;
    profit: number;
  }[];
};

export default function ProfitChart({
  data,
}: Props) {
  return (
    <div className="ocean-card p-4 h-80">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
          />

          <Line
            type="monotone"
            dataKey="profit"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}