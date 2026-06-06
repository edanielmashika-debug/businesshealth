"use client";

import { useState } from "react";

import {
  useTransactionStore,
} from "@/store/transaction-store";

import {
  createTransaction,
} from "@/services/transaction-service";

import {
  useExpenseStore,
} from "@/store/expense-store";

import SmsImport from "@/components/sms-import";

import {
  X,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles,
} from "lucide-react";

export default function AddTransactionForm() {

  const addTransaction =
    useTransactionStore(
      (state) =>
        state.addTransaction
    );

  const addExpense =
    useExpenseStore(
      (state) =>
        state.addExpense
    );

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [type, setType] =
    useState<
      "revenue" | "expense"
    >("revenue");

  const [
    showSmsImport,
    setShowSmsImport,
  ] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (
      !title ||
      !amount ||
      !category
    )
      return;

    const newTransaction = {

      id:
        crypto.randomUUID(),

      title,

      amount:
        Number(amount),

      category,

      type,

      source:
        "manual" as const,

      createdAt:
        new Date().toISOString(),
    };

    addTransaction(
      newTransaction
    );

    await createTransaction(
      newTransaction
    );

    if (
      type === "expense"
    ) {

      addExpense({

        id:
          crypto.randomUUID(),

        title,

        amount:
          Number(amount),

        category,

        createdAt:
          new Date().toISOString(),
      });
    }

    setTitle("");

    setAmount("");

    setCategory("");

    setType(
      "revenue"
    );
  }

  return (
    <>
      <form
        onSubmit={
          handleSubmit
        }
        className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm"
      >

        {/* TOP GRADIENT */}

        <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 p-6 md:p-8 space-y-7">

          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">

                <Sparkles className="w-4 h-4" />

                New Transaction

              </div>

              <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-5">
                Add Cashflow
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Record business revenue and expenses instantly.
              </p>

            </div>

            <div className="hidden md:flex w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white items-center justify-center shadow-xl">

              <Wallet size={30} />

            </div>

          </div>

          {/* TYPE SWITCH */}

          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() =>
                setType(
                  "revenue"
                )
              }
              className={`rounded-3xl p-5 border transition-all duration-300 ${
                type ===
                "revenue"
                  ? "border-green-500 bg-green-50 dark:bg-green-500/10 shadow-lg scale-[1.01]"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >

              <div className="flex items-center gap-3">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    type ===
                    "revenue"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-500"
                  }`}
                >

                  <ArrowDownCircle className="w-6 h-6" />

                </div>

                <div className="text-left">

                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Revenue
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Money coming in
                  </p>

                </div>

              </div>

            </button>

            <button
              type="button"
              onClick={() =>
                setType(
                  "expense"
                )
              }
              className={`rounded-3xl p-5 border transition-all duration-300 ${
                type ===
                "expense"
                  ? "border-red-500 bg-red-50 dark:bg-red-500/10 shadow-lg scale-[1.01]"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >

              <div className="flex items-center gap-3">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    type ===
                    "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-500"
                  }`}
                >

                  <ArrowUpCircle className="w-6 h-6" />

                </div>

                <div className="text-left">

                  <h3 className="font-bold text-gray-800 dark:text-white">
                    Expense
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Money going out
                  </p>

                </div>

              </div>

            </button>

          </div>

          {/* FORM GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                Transaction Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Shop Sale"
                className="w-full mt-3 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
              />

            </div>

            {/* AMOUNT */}

            <div>

              <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                Amount
              </label>

              <div className="relative mt-3">

                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                  TZS
                </span>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                  placeholder="50000"
                  className="w-full rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-16 pr-5 py-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="Sales"
                className="w-full mt-3 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="space-y-4 pt-2">

            <button
              type="submit"
              className={`w-full rounded-3xl py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                type ===
                "revenue"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
            >

              Save Transaction

            </button>

            <button
              type="button"
              onClick={() =>
                setShowSmsImport(
                  true
                )
              }
              className="w-full rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-5 font-semibold text-gray-700 dark:text-slate-200 hover:scale-[1.01] transition"
            >

              Import From SMS

            </button>

          </div>

        </div>

      </form>

      {/* SMS IMPORT POPUP */}

      {
        showSmsImport && (

          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">

              {/* TOP BAR */}

              <div className="h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

              {/* GLOW */}

              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setShowSmsImport(
                    false
                  )
                }
                className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >

                <X size={20} />

              </button>

              <div className="relative z-10 p-6 md:p-8">

                <div className="mb-8">

                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">

                    📩 SMS Import

                  </div>

                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-5">
                    Import Mobile Money SMS
                  </h2>

                  <p className="text-gray-500 dark:text-slate-400 mt-2">
                    Paste transaction SMS messages and auto-convert them into records.
                  </p>

                </div>

                <SmsImport />

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}
