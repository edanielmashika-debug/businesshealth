"use client";

import { useState } from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
  generateSalesPDF,
} from "../../lib/pdf-report";

import {
  useSalesStore,
} from "../../store/sales-store";

import ReportChart from "../../components/report-chart";

export default function ReportsPage() {

  const sales =
    useSalesStore(
      (state) =>
        state.sales
    );

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const filteredSales =
    sales.filter((sale) => {

      if (
        !startDate ||
        !endDate
      )
        return true;

      const saleDate =
        new Date(
          sale.createdAt
        );

      return (
        saleDate >=
        new Date(startDate) &&
        saleDate <=
        new Date(endDate)
      );
    });

  const totalRevenue =
    filteredSales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0
    );

  const totalProfit =
    filteredSales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  const totalSales =
    filteredSales.length;

  const chartData =
    filteredSales.map(
      (sale) => ({

        date:
          new Date(
            sale.createdAt
          ).toLocaleDateString(),

        revenue:
          sale.total,

        profit:
          sale.profit,
      })
    );

  const now =
    new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const currentMonthSales =
    filteredSales.filter(
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
    filteredSales.filter(
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

  const currentProfit =
    currentMonthSales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  const lastProfit =
    lastMonthSales.reduce(
      (sum, sale) =>
        sum + sale.profit,
      0
    );

  const profitGrowth =
    lastProfit === 0
      ? 100
      : (
        (
          currentProfit -
          lastProfit
        ) /
        lastProfit
      ) * 100;

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Reports
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Pakua ripoti za biashara yako
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

          <h2 className="text-xl font-bold text-black dark:text-white">
            Chuja Ripoti Kwa Tarehe
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Chagua Kipindi Cha Ripoti
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">

            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Tarehe ya kuanza
            </span>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-4 bg-gray-50 dark:bg-slate-800 text-black dark:text-white"
            />

            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Tarehe ya mwisho
            </span>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-4 bg-gray-50 dark:bg-slate-800 text-black dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

            <p className="text-sm text-blue-600">
              Revenue
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              TZS{" "}
              {totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

            <p className="text-sm text-green-600">
              Profit
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              TZS{" "}
              {totalProfit.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

            <p className="text-sm text-cyan-600">
              Sales Count
            </p>

            <h2 className="text-3xl font-bold text-black dark:text-white mt-2">
              {totalSales}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
            <ReportChart
              data={chartData}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

              <p className="text-sm text-blue-600">
                Monthly Revenue Growth
              </p>

              <h2 className="text-4xl font-bold text-black dark:text-white mt-3">
                {revenueGrowth.toFixed(1)}%
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-2">

                TZS{" "}
                {currentRevenue.toLocaleString()}

                {" "}vs{" "}

                TZS{" "}
                {lastRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

              <p className="text-sm text-cyan-600">
                Monthly Profit Growth
              </p>

              <h2 className="text-4xl font-bold text-black dark:text-white mt-3">
                {profitGrowth.toFixed(1)}%
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-2">

                TZS{" "}
                {currentProfit.toLocaleString()}

                {" "}vs{" "}

                TZS{" "}
                {lastProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-black dark:text-white">
                Sales Report
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Download sales PDF report
              </p>
            </div>

            <button
              onClick={() =>
                generateSalesPDF(
                  filteredSales
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold transition"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}