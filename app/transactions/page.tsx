"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard-layout";

import AddTransactionForm from "@/components/add-transaction-form";

import SmsImport from "@/components/sms-import";

import TransactionList from "@/components/transaction-list";

import { useTransactionStore } from "@/store/transaction-store";

import {
  getTransactions,
  deleteTransaction,
} from "@/services/transaction-service";

import { X } from "lucide-react";

export default function TransactionsPage() {

  const transactions =
    useTransactionStore(
      (state) =>
        state.transactions
    );

  const setTransactions =
    useTransactionStore(
      (state) =>
        state.setTransactions
    );

  const removeTransaction =
    useTransactionStore(
      (state) =>
        state.removeTransaction
    );

  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {

    async function loadTransactions() {

      const data =
        await getTransactions();

      if (!data) return;

      setTransactions(data);
    }

    loadTransactions();

  }, [setTransactions]);

  async function handleDelete(
    id: string
  ) {

    removeTransaction(id);

    await deleteTransaction(id);
  }

  const totalRevenue =
    transactions
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

  const totalExpenses =
    transactions
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

  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Transactions
            </h1>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Manage your business money flow
            </p>

          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            + Add Transaction
          </button>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <p className="text-sm opacity-80">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-3">
              TZS{" "}
              {totalRevenue.toLocaleString()}
            </h2>

          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl p-6 text-white shadow-lg">

            <p className="text-sm opacity-80">
              Expenses
            </p>

            <h2 className="text-4xl font-bold mt-3">
              TZS{" "}
              {totalExpenses.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* SMS IMPORT */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              SMS Import
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Import M-Pesa and mobile money transactions
            </p>

          </div>

          <SmsImport />

        </div>

        {/* TRANSACTION LIST */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Transactions
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Your latest business activity
            </p>

          </div>

          <TransactionList
            transactions={
              transactions
            }
            onDelete={
              handleDelete
            }
          />

        </div>

      </div>

      {/* POPUP FORM */}

      {
        showForm && (

          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">

              {/* CLOSE BUTTON */}

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >

                <X size={20} />

              </button>

              <div className="p-6">

                <AddTransactionForm />

              </div>

            </div>

          </div>
        )
      }

    </DashboardLayout>
  );
}