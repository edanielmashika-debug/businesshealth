"use client";

import { useEffect } from "react";


import {
  useDashboardAIStore,
} from "@/store/dashboard-ai-store";

import DashboardLayout from "@/components/dashboard-layout";
import DashboardCard from "@/components/dashboard-card";

import AnalyticsChart from "@/components/analytics-chart";
import CategoryChart from "@/components/category-chart";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import WeeklySummaryCard from "@/components/weekly-summary-card";

import { getTransactions } from "@/services/transaction-service";

import { useTransactionStore } from "@/store/transaction-store";

import { useInventoryStore } from "@/store/inventory-store";

import { useSalesStore } from "@/store/sales-store";

import { useExpenseStore } from "@/store/expense-store";

import { useRouter } from "next/navigation";
import { useDebtStore } from "@/store/debt-store";

import { supabase } from "@/lib/supabase";
import AiInsightsCard from "@/components/ai-insights-card";

import AiPredictionsCard from "@/components/ai-predictions-card";

import AiRecommendationsCard from "@/components/ai-recommendations-card";

import { generateRecommendations } from "@/services/ai-recommendations";

import { generatePredictions } from "@/services/ai-predictions";
import { generateInsights } from "@/services/ai-insights";
import { useTranslation } from "@/hooks/useTranslation";


export default function HomePage() {

  const {
    income,
    expense,
    profit,
  } = useDashboardStats();

  const t = useTranslation();


  const router = useRouter();

  const setTransactions =
    useTransactionStore(
      (state) =>
        state.setTransactions
    );

  const products =
    useInventoryStore(
      (state) =>
        state.products
    );

  const fetchProducts =
    useInventoryStore(
      (state) =>
        state.fetchProducts
    );

  const sales =
    useSalesStore(
      (state) =>
        state.sales
    );

  const fetchSales =
    useSalesStore(
      (state) =>
        state.fetchSales
    );

  const expenses =
    useExpenseStore(
      (state) =>
        state.expenses
    );

  const fetchExpenses =
    useExpenseStore(
      (state) =>
        state.fetchExpenses
    );

  const {
    recommendation,
    prediction,
    weeklySummary,
    businessInsight,
    loading,
    fetchInsights,
  } =
    useDashboardAIStore();




  useEffect(() => {
    fetchInsights({
  sales,
  expenses,
  products,
  debts,
});
  }, []);
  useEffect(() => {

    async function checkUser() {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        router.push(
          "/signup"
        );

        return;
      }

      /*
        LOAD PROFILE
      */

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      /*
        ONBOARDING CHECK
      */

      if (
        profile &&
        !profile.onboarding_completed
      ) {

        router.push(
          "/onboarding"
        );

        return;
      }
    }

    async function loadTransactions() {

      const data =
        await getTransactions();

      if (!data) return;

      const formatted =
        data.map(
          (transaction: any) => ({
            id: transaction.id,

            title:
              transaction.title,

            amount: Number(
              transaction.amount
            ),

            category:
              transaction.category,

            type:
              transaction.type,

            source:
              transaction.source,

            createdAt:
              transaction.created_at,
          })
        );

      setTransactions(
        formatted
      );
    }

    checkUser();

    loadTransactions();

    fetchProducts();

    fetchSales();

    fetchExpenses();

  }, [
    setTransactions,
    router,
    fetchProducts,
    fetchSales,
    fetchExpenses,
  ]);

  const totalRevenue =
    sales.reduce(
      (
        sum,
        sale
      ) =>
        sum +
        sale.total,
      0
    );

  const totalProfit =
    sales.reduce(
      (
        sum,
        sale
      ) =>
        sum +
        sale.profit,
      0
    );

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

  const netProfit =
    totalProfit -
    totalExpenses;

  const lowStockProducts =
    products.filter(
      (product) =>
        product.stock <= 5
    );

  const bestSellerMap =
    sales.reduce(
      (
        acc,
        sale
      ) => {

        acc[
          sale.productName
        ] =
          (acc[
            sale.productName
          ] || 0) +
          sale.quantity;

        return acc;

      },
      {} as Record<
        string,
        number
      >
    );

  const bestSeller =
    Object.entries(
      bestSellerMap
    ).sort(
      (
        a,
        b
      ) =>
        b[1] - a[1]
    )[0];

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock <= 5
    ).length;

  const totalProducts =
    products.length;

  const debts =
    useDebtStore(
      (state) => state.debts
    );

  const pendingDebts =
    debts.filter(
      (debt) =>
        debt.status === "pending"
    );

  const predictions =
    generatePredictions({

      totalRevenue,

      totalExpenses,

      lowStockCount,

      pendingDebts:
        pendingDebts.length,
    });

  const recommendations =
    generateRecommendations({

      products,

      debts,

      totalRevenue,

      totalExpenses,
    });




  const insights = generateInsights({

    totalRevenue,

    totalExpenses,

    lowStockCount,

    pendingDebts:

      pendingDebts.length,

    totalProducts,
  });

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Business overview and analytics
          </p>
        </div>

        {/* TOP STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <DashboardCard
            title="Revenue"
            amount={`TZS ${totalRevenue.toLocaleString()}`}

          />

          <DashboardCard
            title="Profit"
            amount={`TZS ${totalProfit.toLocaleString()}`}
          />

          <DashboardCard
            title="Expenses"
            amount={`TZS ${totalExpenses.toLocaleString()}`}
          />

          <DashboardCard
            title="Net Profit"
            amount={`TZS ${netProfit.toLocaleString()}`}
          />
        </div>

        {/* AI */}
        <AiInsightsCard
          insights={
            businessInsight
              ? [businessInsight]
              : [
                "Analyzing business insights..."
              ]
          }
        />

<WeeklySummaryCard
  revenue={totalRevenue}
  expenses={totalExpenses}
  profit={profit}
  lowStockCount={lowStockCount}
  pendingDebts={
    pendingDebts.length
  }
  aiSummary={
    weeklySummary
  }
/>

        <AiPredictionsCard
          predictions={
            prediction
              ? [prediction]
              : [
                "Generating prediction..."
              ]
          }
        />

        <AiRecommendationsCard
          recommendations={
            recommendation
              ? [recommendation]
              : [
                "Analyzing your business..."
              ]
          }
        />

        {/* SECOND ROW */}

        < div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* BEST SELLER */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Best Seller
            </p>

            <h2 className="text-2xl font-bold text-black mt-3">
              {bestSeller
                ? bestSeller[0]
                : "No sales yet"}
            </h2>

            <p className="text-blue-600 mt-2">
              {bestSeller
                ? `${bestSeller[1]} units sold`
                : ""}
            </p>
          </div>

          {/* LOW STOCK */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Low Stock Alerts
            </p>

            <h2 className="text-4xl font-bold text-red-500 mt-3">
              {
                lowStockProducts.length
              }
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
              Products running low
            </p>
          </div>

          {/* PRODUCTS */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Total Products
            </p>

            <h2 className="text-4xl font-bold text-blue-600 mt-3">
              {products.length}
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
              Inventory items
            </p>
          </div>
        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-black">
                Revenue Analytics
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Sales and revenue trends
              </p>
            </div>

            <AnalyticsChart />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-black">
                Category Breakdown
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Expense and income categories
              </p>
            </div>

            <CategoryChart />
          </div>
        </div>

        {/* LOW STOCK LIST */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-black">
                Inventory Alerts
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Products that need restocking
              </p>
            </div>
          </div>

          <div className="space-y-4">

            {lowStockProducts.length ===
              0 ? (

              <div className="text-gray-500 dark:text-slate-400 text-sm">
                No low stock alerts
              </div>

            ) : (

              lowStockProducts.map(
                (product) => (
                  <div
                    key={
                      product.id
                    }
                    className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl p-4"
                  >

                    <div>

                      <h3 className="font-semibold text-black">
                        {
                          product.name
                        }
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Low stock detected
                      </p>
                    </div>

                    <div className="text-right">

                      <h2 className="text-2xl font-bold text-red-500">
                        {
                          product.stock
                        }
                      </h2>

                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        left
                      </p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

      </div>
    </DashboardLayout >
  );
}