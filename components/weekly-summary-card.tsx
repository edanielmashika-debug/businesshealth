"use client";

import {
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";

export default function WeeklySummaryCard({
  revenue,
  expenses,
  profit,
  lowStockCount,
  pendingDebts,
}: {
  revenue: number;
  expenses: number;
  profit: number;
  lowStockCount: number;
  pendingDebts: number;
}) {

  const isProfitPositive =
    profit >= 0;

  return (

    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 p-7 text-white shadow-2xl">

      {/* GLOW */}

      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-300/10 rounded-full blur-3xl" />

      {/* HEADER */}

      <div className="relative z-10 flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">

          <Sparkles className="w-7 h-7" />

        </div>

        <div>

          <h2 className="text-2xl font-bold">
            Weekly AI Summary
          </h2>

          <p className="text-white/70 text-sm mt-1">
            Smart overview of your business performance
          </p>

        </div>
      </div>

      {/* CONTENT */}

      <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* REVENUE */}

        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5">

          <p className="text-sm text-white/70">
            Revenue
          </p>

          <h3 className="text-3xl font-bold mt-2">
            TZS {revenue.toLocaleString()}
          </h3>

        </div>

        {/* EXPENSES */}

        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5">

          <p className="text-sm text-white/70">
            Expenses
          </p>

          <h3 className="text-3xl font-bold mt-2">
            TZS {expenses.toLocaleString()}
          </h3>

        </div>

        {/* PROFIT */}

        <div className="rounded-2xl bg-black/20 border border-white/10 p-5">

          <div className="flex items-center gap-2">

            {isProfitPositive ? (

              <TrendingUp className="w-5 h-5 text-green-300" />

            ) : (

              <TrendingDown className="w-5 h-5 text-red-300" />

            )}

            <p className="text-sm text-white/70">
              Estimated Profit
            </p>

          </div>

          <h3 className="text-3xl font-bold mt-3">

            TZS {profit.toLocaleString()}

          </h3>

        </div>

        {/* ALERTS */}

        <div className="rounded-2xl bg-black/20 border border-white/10 p-5">

          <p className="text-sm text-white/70">
            Business Alerts
          </p>

          <div className="mt-3 space-y-2 text-sm">

            <p>
              • {lowStockCount} low stock products
            </p>

            <p>
              • {pendingDebts} pending debts
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}