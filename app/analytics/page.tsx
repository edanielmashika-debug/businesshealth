"use client";

import DashboardLayout from "../../components/dashboard-layout";

import AnalyticsChart from "../../components/analytics-chart";

import CategoryChart from "../../components/category-chart";
import ProfitChart from "../../components/profit-chart";
import { useInventoryStore } from "../../store/inventory-store";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
} from "lucide-react";


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

  const { products } =
    useInventoryStore();


  const chartData =
    sales.map((sale) => ({
      name:
        sale.productName,

      revenue:
        sale.total,

      profit:
        sale.profit,
    }));

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 5
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {/* TOTAL SALES */}

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

          {/* PROFIT */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">
                  Total Profit
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalProfit.toLocaleString()}
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

          {/* PRODUCTS */}

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-80">
                  Best Seller
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {bestSeller ?
                    bestSeller[0] :
                    "No sales"}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                🔥
              </div>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* SALES CHART */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Revenue Overview
              </h2>

              <p className="text-sm text-gray-500">
                Sales performance analytics
              </p>
            </div>

            <AnalyticsChart />
          </div>

          {/* CATEGORY CHART */}

          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                What expenses are running
              </h2>

              <p className="text-sm text-gray-500">
                Most costful expenditures
              </p>
            </div>

            <CategoryChart />
          </div>

          {/* PROFIT CHART */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Profit Tracking
              </h2>

              <p className="text-sm text-gray-500">
                Check how your business is growinf
              </p>
            </div>

            <ProfitChart data={sales} />

          </div>
          {/* ALERT BANNER */}
                      <div>
            {lowStockProducts.length >
              0 && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-8">

                  <div className="flex items-center justify-between">

                    <div>
                      <h2 className="text-2xl font-bold text-red-600">
                        Low Stock Alert
                      </h2>

                      <p className="text-red-500 mt-1">
                        {lowStockProducts.length}{" "}
                        products are running low
                      </p>
                    </div>

                    <div className="text-5xl">
                      ⚠️
                    </div>
                  </div>

                  {/* PRODUCTS */}

                  <div className="mt-6 grid gap-3">

                    {lowStockProducts.map(
                      (product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-2xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {product.name}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Only{" "}
                              {
                                product.stock
                              }{" "}
                              items left
                            </p>
                          </div>

                          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            Restock
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
}