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

    <div className="space-y-8 pb-10">

      {/* HERO HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 text-white shadow-2xl">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

              <TrendingUp className="w-4 h-4" />

              Business Analytics

            </div>

            <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">
              Financial
              <br />
              Overview
            </h1>

            <p className="text-blue-100 mt-4 max-w-2xl text-lg">
              Monitor revenue, expenses, profits and growth
              across your business in real time.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[260px]">

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/10">

              <p className="text-sm text-blue-100">
                Revenue
              </p>

              <h2 className="text-2xl font-black mt-2">
                TZS {totalRevenue.toLocaleString()}
              </h2>

            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/10">

              <p className="text-sm text-blue-100">
                Profit
              </p>

              <h2 className="text-2xl font-black mt-2">
                TZS {netProfit.toLocaleString()}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* TOP CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* REVENUE */}

        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Revenue
              </p>

              <h2 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">
                TZS {totalRevenue.toLocaleString()}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">

              <DollarSign className="text-blue-600 dark:text-blue-300" />

            </div>

          </div>

        </div>

        {/* EXPENSES */}

        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Expenses
              </p>

              <h2 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">
                TZS {totalExpenses.toLocaleString()}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-2xl">
              💸
            </div>

          </div>

        </div>

        {/* PROFIT */}

        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Net Profit
              </p>

              <h2 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">
                TZS {netProfit.toLocaleString()}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">

              <TrendingUp className="text-green-600 dark:text-green-300" />

            </div>

          </div>

        </div>

        {/* SALES */}

        <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">

          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Total Sales
              </p>

              <h2 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">
                {sales.length}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">

              <ShoppingCart className="text-purple-600 dark:text-purple-300" />

            </div>

          </div>

        </div>

      </div>

      {/* TODAY STATS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <p className="text-sm font-medium text-blue-600">
            Today's Revenue
          </p>

          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">
            TZS {todayRevenue.toLocaleString()}
          </h2>

        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <p className="text-sm font-medium text-red-500">
            Today's Expenses
          </p>

          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">
            TZS {todayExpenses.toLocaleString()}
          </h2>

        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <p className="text-sm font-medium text-green-600">
            Today's Profit
          </p>

          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-3">
            TZS {todayProfit.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* MONTHLY GROWTH */}

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent_40%)]" />

        <div className="relative z-10 flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-widest opacity-80">
              Monthly Growth
            </p>

            <h2 className="text-6xl font-black mt-3">
              {monthlyGrowth.toFixed(1)}%
            </h2>

          </div>

          <div className="w-24 h-24 rounded-[2rem] bg-white/15 backdrop-blur-xl flex items-center justify-center">

            <Wallet size={42} />

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-slate-800">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Revenue Overview
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Combined sales and transaction revenue
            </p>

          </div>

          <AnalyticsChart />

        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-slate-800">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Expense Categories
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Track where money is going
            </p>

          </div>

          <CategoryChart />

        </div>

      </div>

    </div>

  </DashboardLayout>
);
}