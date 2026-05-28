"use client";

import DashboardLayout from "../../components/dashboard-layout";

import AnalyticsChart from "../../components/analytics-chart";

import CategoryChart from "../../components/category-chart";
import ProfitChart from "../../components/profit-chart";
import {
  useSalesStore,
} from "../../store/sales-store";

export default function AnalyticsPage() {

   const sales =
    useSalesStore(
      (state) =>
        state.sales
    );
  const chartData =
    sales.map((sale) => ({
      name:
        sale.productName,

      revenue:
        sale.total,

      profit:
        sale.profit,
    }));


 

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
      (a, b) => b[1] - a[1]
    )[0];

  const totalSales =
    sales.length;


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Business insights and trends
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-4">
            <div className="text-sm text-gray-500">
              Revenue
            </div>

            <div className="text-2xl font-bold">
              TZS{" "}
              {totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <div className="text-sm text-gray-500">
              Profit
            </div>

            <div className="text-2xl font-bold text-green-600">
              TZS{" "}
              {totalProfit.toLocaleString()}
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <div className="text-sm text-gray-500">
              Sales
            </div>

            <div className="text-2xl font-bold">
              {totalSales}
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <div className="text-sm text-gray-500">
              Best Seller
            </div>

            <div className="text-xl font-bold">
              {bestSeller
                ? bestSeller[0]
                : "No sales"}
            </div>
          </div>
        </div>
        <AnalyticsChart />

        <CategoryChart />

        <ProfitChart
          data={chartData}
        />
      </div>
    </DashboardLayout>
  );
}