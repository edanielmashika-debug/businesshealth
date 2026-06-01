"use client";

import { useState } from "react";


import DashboardLayout from "../../components/dashboard-layout";

import {
  generateSalesPDF,
} from "../../lib/pdf-report";

import {
  useSalesStore,
} from "../../store/sales-store";

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

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Reports
          </h1>

          <p className="text-gray-500 mt-1">
            Export your business reports
          </p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">

          <h2 className="text-xl font-bold text-black">
            Filter Reports
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Select report date range
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="border rounded-2xl px-4 py-4 bg-gray-50 text-black"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="border rounded-2xl px-4 py-4 bg-gray-50 text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* REVENUE */}

          <div className="bg-white rounded-3xl border p-6 shadow-sm">

            <p className="text-sm text-blue-600">
              Revenue
            </p>

            <h2 className="text-3xl font-bold text-black mt-2">
              TZS{" "}
              {totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* PROFIT */}

          <div className="bg-white rounded-3xl border p-6 shadow-sm">

            <p className="text-sm text-green-600">
              Profit
            </p>

            <h2 className="text-3xl font-bold text-black mt-2">
              TZS{" "}
              {totalProfit.toLocaleString()}
            </h2>
          </div>

          {/* SALES */}

          <div className="bg-white rounded-3xl border p-6 shadow-sm">

            <p className="text-sm text-cyan-600">
              Sales Count
            </p>

            <h2 className="text-3xl font-bold text-black mt-2">
              {totalSales}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-black">
                Sales Report
              </h2>

              <p className="text-sm text-gray-500 mt-1">
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