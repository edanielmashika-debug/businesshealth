"use client";

import DashboardLayout from "../../components/dashboard-layout";

import AnalyticsChart from "../../components/analytics-chart";
import CategoryChart from "../../components/category-chart";
import ProfitChart from "../../components/profit-chart";

import { useInventoryStore } from "../../store/inventory-store";
import { useExpenseStore } from "../../store/expense-store";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getSales,
} from "../../lib/sales";

export default function AnalyticsPage() {

  const [sales, setSales] =
    useState<any[]>([]);

  useEffect(() => {

    async function loadSales() {

      const data =
        await getSales();

      if (data) {

        const formatted =
          data.map(
            (sale: any) => ({
              id: sale.id,

              productId:
                sale.product_id,

              productName:
                sale.product_name,

              quantity:
                sale.quantity,

              total: Number(
                sale.total
              ),

              profit: Number(
                sale.profit
              ),

              createdAt:
                sale.created_at,
            })
          );

        setSales(
          formatted
        );
      }
    }

    loadSales();

  }, []);

  const {
    expenses,
  } =
    useExpenseStore();

  const {
    products,
  } =
    useInventoryStore();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todaySales =
    sales.filter(
      (sale) =>
        sale.createdAt.startsWith(
          today
        )
    );

  const todayRevenue =
    todaySales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const todayProfit =
    todaySales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  const todaySalesCount =
    todaySales.length;

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        expense.amount,
      0
    );

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const totalProfit =
    sales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  const netProfit =
    totalProfit -
    totalExpenses;

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 5
    );

  const productCount: Record<
    string,
    number
  > = {};

  sales.forEach((sale) => {

    if (
      productCount[
        sale.productName
      ]
    ) {

      productCount[
        sale.productName
      ] += sale.quantity;

    } else {

      productCount[
        sale.productName
      ] = sale.quantity;
    }
  });

  const bestSeller =
    Object.entries(
      productCount
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0];

  const now =
    new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const currentMonthSales =
    sales.filter(
      (sale) => {

        const date =
          new Date(
            sale.createdAt
          );

        return (
          date.getMonth() ===
            currentMonth &&

          date.getFullYear() ===
            currentYear
        );
      }
    );

  const lastMonthSales =
    sales.filter(
      (sale) => {

        const date =
          new Date(
            sale.createdAt
          );

        const lastMonth =
          currentMonth === 0
            ? 11
            : currentMonth - 1;

        const lastMonthYear =
          currentMonth === 0
            ? currentYear - 1
            : currentYear;

        return (
          date.getMonth() ===
            lastMonth &&

          date.getFullYear() ===
            lastMonthYear
        );
      }
    );

  const currentRevenue =
    currentMonthSales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const lastRevenue =
    lastMonthSales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const revenueGrowth =
    lastRevenue === 0
      ? 100
      : (
          (
            currentRevenue -
            lastRevenue
          ) /
          lastRevenue
        ) * 100;

  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Analytics
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Business insights and trends
          </p>
        </div>

        {/* TOP STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* REVENUE */}

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <DollarSign />
              </div>
            </div>
          </div>

          {/* EXPENSES */}

          <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Expenses
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalExpenses.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                💸
              </div>
            </div>
          </div>

          {/* PROFIT */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Net Profit
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {netProfit.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <TrendingUp />
              </div>
            </div>
          </div>

          {/* SALES */}

          <div className="bg-gradient-to-br from-purple-500 to-violet-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Sales Count
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {sales.length}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <ShoppingCart />
              </div>
            </div>
          </div>

          {/* BEST SELLER */}

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Best Seller
                </p>

                <h2 className="text-2xl font-bold mt-2">

                  {bestSeller
                    ? bestSeller[0]
                    : "No sales"}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                🔥
              </div>
            </div>
          </div>

          {/* GROWTH */}

          <div className="bg-gradient-to-br from-cyan-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Monthly Growth
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {revenueGrowth.toFixed(1)}%
                </h2>

                <p className="text-sm opacity-80 mt-2">
                  Revenue vs last month
                </p>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                📊
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S ACTIVITY */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Today's Activity
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              See how your business performed today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="rounded-3xl bg-blue-50 dark:bg-slate-800 p-6">

              <p className="text-sm text-blue-600">
                Today's Revenue
              </p>

              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">

                TZS{" "}
                {todayRevenue.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-3xl bg-green-50 dark:bg-slate-800 p-6">

              <p className="text-sm text-green-600">
                Today's Profit
              </p>

              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">

                TZS{" "}
                {todayProfit.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-3xl bg-purple-50 dark:bg-slate-800 p-6">

              <p className="text-sm text-purple-600">
                Today's Sales
              </p>

              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">

                {todaySalesCount}
              </h2>
            </div>
          </div>
        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* REVENUE CHART */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Sales performance analytics
              </p>
            </div>

            <AnalyticsChart />
          </div>

          {/* EXPENSE CHART */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Expense Analytics
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Business spending categories
              </p>
            </div>

            <CategoryChart />
          </div>

          {/* PROFIT CHART */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-800 xl:col-span-2">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Profit Tracking
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Monitor business profitability
              </p>
            </div>

            <ProfitChart
              data={sales}
            />
          </div>
        </div>

        {/* LOW STOCK */}

        {lowStockProducts.length >
          0 && (

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-red-600">
                  Low Stock Alert
                </h2>

                <p className="text-red-500 mt-1">
                  {
                    lowStockProducts.length
                  }{" "}
                  products are running low
                </p>
              </div>

              <div className="text-5xl">
                ⚠️
              </div>
            </div>

            <div className="mt-6 grid gap-3">

              {lowStockProducts.map(
                (product) => (

                  <div
                    key={
                      product.id
                    }
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between border border-red-100 dark:border-slate-800"
                  >

                    <div>

                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Critical inventory level:{" "}
                        {
                          product.stock
                        }{" "}
                        remaining
                      </p>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/40 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">

                      Restock
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}