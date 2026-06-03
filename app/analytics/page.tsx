"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard-layout";

import AnalyticsChart from "../../components/analytics-chart";
import CategoryChart from "../../components/category-chart";
import ProfitChart from "../../components/profit-chart";

import {
  useInventoryStore,
} from "../../store/inventory-store";

import {
  useExpenseStore,
} from "../../store/expense-store";

import {
  useTransactionStore,
} from "../../store/transaction-store";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Wallet,
} from "lucide-react";

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

      if (!data) return;

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

            total:
              Number(
                sale.total
              ),

            profit:
              Number(
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

    loadSales();

  }, []);

  const { products } =
    useInventoryStore();

  const { expenses } =
    useExpenseStore();

  const transactions =
    useTransactionStore(
      (state) =>
        state.transactions
    );

  /* =================================
      SALES DATA
  ================================= */

  const salesRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const salesProfit =
    sales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  /* =================================
      TRANSACTION DATA
  ================================= */

  const revenueTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type ===
        "revenue"
    );

  const expenseTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type ===
        "expense"
    );

  const transactionRevenue =
    revenueTransactions.reduce(
      (sum, transaction) =>
        sum +
        transaction.amount,
      0
    );

  const transactionExpenses =
    expenseTransactions.reduce(
      (sum, transaction) =>
        sum +
        transaction.amount,
      0
    );

  /* =================================
      MANUAL EXPENSES
  ================================= */

  const manualExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        expense.amount,
      0
    );

  /* =================================
      FINAL BUSINESS NUMBERS
  ================================= */

  const totalRevenue =
    salesRevenue +
    transactionRevenue;

  const totalExpenses =
    manualExpenses +
    transactionExpenses;

  const netProfit =
    totalRevenue -
    totalExpenses;

  /* =================================
      TODAY STATS
  ================================= */

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

  const todayTransactions =
    transactions.filter(
      (transaction) =>
        transaction.createdAt.startsWith(
          today
        )
    );

  const todayRevenue =
    todaySales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    ) +
    todayTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "revenue"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          transaction.amount,
        0
      );

  const todayExpenses =
    expenses
      .filter(
        (expense) =>
          expense.createdAt.startsWith(
            today
          )
      )
      .reduce(
        (sum, expense) =>
          sum +
          expense.amount,
        0
      ) +
    todayTransactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (sum, transaction) =>
          sum +
          transaction.amount,
        0
      );

  const todayProfit =
    todayRevenue -
    todayExpenses;

  /* =================================
      MONTHLY GROWTH
  ================================= */

  const monthlyGrowth =
    useMemo(() => {

      const now =
        new Date();

      const currentMonth =
        now.getMonth();

      const currentYear =
        now.getFullYear();

      const lastMonth =
        currentMonth === 0
          ? 11
          : currentMonth - 1;

      const lastMonthYear =
        currentMonth === 0
          ? currentYear - 1
          : currentYear;

      const currentRevenue =
        transactions
          .filter(
            (transaction) => {

              const date =
                new Date(
                  transaction.createdAt
                );

              return (
                transaction.type ===
                  "revenue" &&
                date.getMonth() ===
                  currentMonth &&
                date.getFullYear() ===
                  currentYear
              );
            }
          )
          .reduce(
            (
              sum,
              transaction
            ) =>
              sum +
              transaction.amount,
            0
          ) +
        sales
          .filter(
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
          )
          .reduce(
            (sum, sale) =>
              sum +
              sale.total,
            0
          );

      const previousRevenue =
        transactions
          .filter(
            (transaction) => {

              const date =
                new Date(
                  transaction.createdAt
                );

              return (
                transaction.type ===
                  "revenue" &&
                date.getMonth() ===
                  lastMonth &&
                date.getFullYear() ===
                  lastMonthYear
              );
            }
          )
          .reduce(
            (
              sum,
              transaction
            ) =>
              sum +
              transaction.amount,
            0
          ) +
        sales
          .filter(
            (sale) => {

              const date =
                new Date(
                  sale.createdAt
                );

              return (
                date.getMonth() ===
                  lastMonth &&
                date.getFullYear() ===
                  lastMonthYear
              );
            }
          )
          .reduce(
            (sum, sale) =>
              sum +
              sale.total,
            0
          );

      if (
        previousRevenue === 0
      ) {
        return 100;
      }

      return (
        (
          currentRevenue -
          previousRevenue
        ) /
        previousRevenue
      ) * 100;

    }, [
      transactions,
      sales,
    ]);

  /* =================================
      LOW STOCK
  ================================= */

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 5
    );

  /* =================================
      BEST SELLER
  ================================= */

  const productCount:
    Record<
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
      ] +=
        sale.quantity;

    } else {

      productCount[
        sale.productName
      ] =
        sale.quantity;
    }
  });

  const bestSeller =
    Object.entries(
      productCount
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0];

  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Analytics
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Full business money flow overview
          </p>

        </div>

        {/* TOP CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* REVENUE */}

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg">

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
                  Total Expenses
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
                  Total Sales
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

        </div>

        {/* SECOND ROW */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-6 shadow-sm">

            <p className="text-sm text-blue-600">
              Today's Revenue
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              TZS{" "}
              {todayRevenue.toLocaleString()}
            </h2>

          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-6 shadow-sm">

            <p className="text-sm text-red-500">
              Today's Expenses
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              TZS{" "}
              {todayExpenses.toLocaleString()}
            </h2>

          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 p-6 shadow-sm">

            <p className="text-sm text-green-600">
              Today's Profit
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              TZS{" "}
              {todayProfit.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* MONTHLY GROWTH */}

        <div className="bg-gradient-to-r from-cyan-500 to-blue-700 rounded-3xl p-6 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm opacity-80">
                Monthly Revenue Growth
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {monthlyGrowth.toFixed(
                  1
                )}%
              </h2>

            </div>

            <div className="bg-white/20 p-5 rounded-3xl">

              <Wallet size={40} />

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border dark:border-slate-800">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Combined sales and transaction revenue
              </p>

            </div>

            <AnalyticsChart />

          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border dark:border-slate-800">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Expense Categories
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Track where money is going
              </p>

            </div>

            <CategoryChart />

          </div>

        </div>

        {/* PROFIT CHART */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border dark:border-slate-800">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Profit Performance
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Business growth analytics
            </p>

          </div>

          <ProfitChart data={sales} />

        </div>

        {/* BEST SELLER */}

        {bestSeller && (

          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Best Selling Product
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {bestSeller[0]}
                </h2>

                <p className="mt-2 opacity-90">
                  {bestSeller[1]} items sold
                </p>

              </div>

              <div className="text-6xl">
                🏆
              </div>

            </div>

          </div>
        )}

        {/* LOW STOCK */}

        {lowStockProducts.length >
          0 && (

          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-red-600">
                  Low Stock Alert
                </h2>

                <p className="text-red-500 mt-1">
                  {lowStockProducts.length} products need restocking
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
                    key={product.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between border dark:border-slate-800"
                  >

                    <div>

                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Only {product.stock} items left
                      </p>

                    </div>

                    <div className="bg-red-100 dark:bg-red-500/20 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
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