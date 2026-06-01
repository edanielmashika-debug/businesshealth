"use client";

import { useEffect } from "react";

import DashboardLayout from "@/components/dashboard-layout";
import DashboardCard from "@/components/dashboard-card";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";

import { getTransactions } from "@/services/transaction-service";

import { useTransactionStore } from "@/store/transaction-store";

import { useInventoryStore } from "@/store/inventory-store";

import { useSalesStore } from "@/store/sales-store";

import { useExpenseStore } from "@/store/expense-store";

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

          type:
            transaction.type as
              | "income"
              | "expense