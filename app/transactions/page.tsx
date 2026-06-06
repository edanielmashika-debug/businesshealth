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

import { Plus } from "lucide-react";



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

    <div className="space-y-8 pb-10">

      {/* HERO HEADER */}

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 text-white shadow-2xl">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
              💳 Transactions
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">
              Business
              <br />
              Cashflow
            </h1>

            <p className="text-blue-100 mt-4 max-w-2xl text-lg">
              Track every income and expense flowing through your business.
            </p>

          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="w-20 h-20 rounded-[2rem] bg-white text-blue-700 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
          >

            <Plus size={40} />

          </button>

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* REVENUE */}

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Revenue
            </p>

            <h2 className="text-4xl font-black mt-3 text-green-600">
              TZS {totalRevenue().toLocaleString()}
            </h2>

          </div>

        </div>

        {/* EXPENSES */}

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

          <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Expenses
            </p>

            <h2 className="text-4xl font-black mt-3 text-red-500">
              TZS {totalExpenses().toLocaleString()}
            </h2>

          </div>

        </div>

        {/* BALANCE */}

        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition">

          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
              Net Balance
            </p>

            <h2 className="text-4xl font-black mt-3 text-blue-600 dark:text-blue-400">
              TZS {netBalance().toLocaleString()}
            </h2>

          </div>

        </div>

      </div>

      {/* TRANSACTION LIST */}

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recent Transactions
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Full business transaction history
            </p>

          </div>

          <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-2xl font-semibold">
            {transactions.length} Records
          </div>

        </div>

        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
        />

      </div>

    </div>

    {/* POPUP */}

{
  showForm && (

    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md overflow-y-auto">

      <div className="min-h-screen flex items-start justify-center p-4 py-10">

        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">

          {/* TOP GRADIENT */}

          <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setShowForm(false)
            }
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
          >
            ✕
          </button>

          {/* SCROLLABLE CONTENT */}

          <div className="max-h-[85vh] overflow-y-auto p-6">

            <AddTransactionForm />

          </div>

        </div>

      </div>

    </div>
  )
}

  </DashboardLayout>
);


}

