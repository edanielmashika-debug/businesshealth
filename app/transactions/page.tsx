"use client";

import DashboardLayout from "@/components/dashboard-layout";

import AddTransactionForm from "@/components/add-transaction-form";

import TransactionList from "@/components/transaction-list";

import SMSImport from "@/components/sms-import";
import { useEffect, useState } from "react";

import {
  getTransactions,
  deleteTransactionFromDB,
} from "@/services/transaction-service";



import {
  useTransactionStore,
} from "@/store/transaction-store";

export default function TransactionsPage() {

  const {
    totalRevenue,
    totalExpenses,
    netBalance,
  } =
    useTransactionStore();


  const transactions =
    useTransactionStore(
      (state) =>
        state.transactions
    );

  const deleteTransaction =
    useTransactionStore(
      (state) =>
        state.deleteTransaction
    );


  const setTransactions =
    useTransactionStore(
      (state) =>
        state.setTransactions
    );




  useEffect(() => {

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

            amount:
              Number(
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


    async function handleDelete(
      id: string
    ) {

      deleteTransaction(id);

      await deleteTransactionFromDB(
        id
      );
    }


    loadTransactions();

  }, []);

  const [showForm, setShowForm] =
    useState(false);



  return (

    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Transactions
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your business cashflow
          </p>
        </div>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* REVENUE */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <p className="text-sm opacity-80">
              Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2">

              TZS{" "}
              {totalRevenue().toLocaleString()}
            </h2>
          </div>

          {/* EXPENSES */}

          <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl p-6 text-white shadow-lg">

            <p className="text-sm opacity-80">
              Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">

              TZS{" "}
              {totalExpenses().toLocaleString()}
            </h2>
          </div>

          {/* BALANCE */}

          <div className="bg-gradient-to-br from-blue-500 to-cyan-700 rounded-3xl p-6 text-white shadow-lg">

            <p className="text-sm opacity-80">
              Net Balance
            </p>

            <h2 className="text-3xl font-bold mt-2">

              TZS{" "}
              {netBalance().toLocaleString()}
            </h2>
          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ADD TRANSACTION */}

          <div className="w-fit bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4 p-4">

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              + Add Transaction
            </button>

            <button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                 Import from SMS
              </button>

          </div>

          {/* SMS IMPORT */}

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

            <SMSImport />
          </div>

          {/* TRANSACTIONS LIST */}

          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">

            <TransactionList transactions={transactions}
              onDelete={deleteTransaction} />
          </div>
        </div>
      </div>
      {/* show it inside */}
      {
        showForm && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">

              {/* CLOSE BUTTON */}

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >
                ✕
              </button>

              <div className="p-6">
                <AddTransactionForm />
              </div>

            </div>

          </div>
        )
      }
      {/* end it here now! */}
    </DashboardLayout>
  );


}

