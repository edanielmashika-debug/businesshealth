"use client";

import { useEffect } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import DashboardCard from "@/components/dashboard-card";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";

import { getTransactions } from "@/services/transaction-service";

import { useTransactionStore } from "@/store/transaction-store";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import AnalyticsChart from "@/components/analytics-chart";
import CategoryChart from "@/components/category-chart";
import SMSImport from "@/components/sms-import";

export default function HomePage() {
  const {
    income,
    expense,
    profit,
  } = useDashboardStats();

  const router = useRouter();

  const setTransactions =
    useTransactionStore(
      (state) =>
        state.setTransactions
    );

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");

        return;
      }
    }

    async function loadTransactions() {
      const data =
        await getTransactions();

      if (!data) return;

      const formatted =
        data.map((transaction) => ({
          id: transaction.id,

          amount: Number(
            transaction.amount
          ),

          category:
            transaction.category,

          type: transaction.type as
            | "income"
            | "expense",

          paymentMethod:
            transaction.payment_method as
            | "cash"
            | "mpesa"
            | "airtel money",

          createdAt:
            transaction.created_at,
        }));

      setTransactions(formatted);
    }
    checkUser();
    loadTransactions();
  }, [setTransactions]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <DashboardCard
          title="Income"
          amount={`TZS` + income}
        />

        <DashboardCard
          title="Expenses"
          amount={`TZS` + expense}
        />

        <DashboardCard
          title="Profit"
          amount={`TZS` + profit}
        />
      </div>

      <div className="mt-6">
        <AnalyticsChart/>
        <CategoryChart/>
      </div>
    </DashboardLayout>
  );
}