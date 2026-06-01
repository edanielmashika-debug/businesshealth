"use client";

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
                  sales
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