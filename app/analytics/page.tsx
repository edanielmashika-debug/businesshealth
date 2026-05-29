"use client";

import DashboardLayout from "../../components/dashboard-layout";

import AnalyticsChart from "../../components/analytics-chart";

import CategoryChart from "../../components/category-chart";
import ProfitChart from "../../components/profit-chart";
import {
  useSalesStore,
} from "../../store/sales-store";

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
          <h1 className="text-3xl font-bold text-rose-950">
            Analytics
          </h1>

          <p className="text-gray-500 mt-1">
            Business insights and trends
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-4 ocean-general">
            <div className="text-sm text-gray-500">
              Revenue
            </div>

            <div className="text-2xl font-bold">
              TZS{" "}
              {totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="border rounded-xl p-4 ocean-general">
            <div className="text-sm text-gray-500">
              Profit
            </div>

            <div className="text-2xl font-bold text-green-600">
              TZS{" "}
              {totalProfit.toLocaleString()}
            </div>
          </div>

          <div className="border rounded-xl p-4 ocean-general">
            <div className="text-sm text-gray-500">
              Sales
            </div>

            <div className="text-2xl font-bold text-rose-950">
              {totalSales}
            </div>
          </div>

          <div className="border rounded-xl p-4 ocean-general">
            <div className="text-sm text-gray-500">
              Best Seller
            </div>

            <div className="text-xl font-bold text-rose-950">
              {bestSeller
                ? bestSeller[0]
                : "No sales"}
            </div>
          </div>
        </div>
        <AnalyticsChart />
        <div className="border rounded-2xl p-5 space-y-4">
          <h2 className="text-xl font-bold">
            Daily Report
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">
                Today Revenue
              </div>

              <div className="text-xl font-bold">
                TZS{" "}
                {todayRevenue.toLocaleString()}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">
                Today Profit
              </div>

              <div className="text-xl font-bold text-green-600">
                TZS{" "}
                {todayProfit.toLocaleString()}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">
                Sales Today
              </div>

              <div className="text-xl font-bold">
                {todaySalesCount}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">
                Average Sale
              </div>

              <div className="text-xl font-bold">
                TZS{" "}
                {todaySalesCount > 0
                  ? Math.round(
                    todayRevenue /
                    todaySalesCount
                  ).toLocaleString()
                  : 0}
              </div>
            </div>
          </div>
        </div>
        <CategoryChart />

        <ProfitChart
          data={chartData}
        />
      </div>
    </DashboardLayout>
  );
}