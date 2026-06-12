
"use client";

import { useState } from "react";

import { useTransactionStore } from "@/store/transaction-store";

import { createTransaction } from "@/services/transaction-service";


import SmsImport from "@/components/sms-import";
import { useTranslation } from "@/hooks/useTranslation";

import {
  X,
  Plus,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles,
} from "lucide-react";

export default function AddTransactionForm() {

  const t = useTranslation();
  const addTransaction =
    useTransactionStore(
      (state) => state.addTransaction
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

  const [showSmsImport, setShowSmsImport] =
    useState(false);

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
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-6 text-white shadow-xl">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

          <div className="relative z-10 flex items-start justify-between gap-4">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold">

                <Sparkles className="w-4 h-4" />

                {t.smartTransactions}
              </div>

              <h2 className="text-3xl font-black mt-5 leading-tight">
                {t.add}
                <br />
                {t.transaction}
              </h2>

              <p className="text-blue-100 mt-3 max-w-xl">
                {t.transactionDescription}
              </p>

            </div>

            <div className="hidden md:flex w-16 h-16 rounded-3xl bg-white text-blue-700 items-center justify-center shadow-2xl">

              <Wallet size={30} />

            </div>

          </div>

        </div>

        {/* FORM CARD */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-5">

          {/* TITLE */}

          <div>

            <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
               {t.transactionTitle}
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
              className="w-full mt-3 rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
            />

          </div>

          {/* AMOUNT */}

          <div>

            <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              {t.amount}
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="50000"
              className="w-full mt-3 rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              {t.category}
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
              className="w-full mt-3 rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 transition"
            />

          </div>

          {/* TYPE */}

          <div>

            <label className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              {t.transactionType}
            </label>

            <div className="grid grid-cols-2 gap-4 mt-3">

              <button
                type="button"
                onClick={() =>
                  setType(
                    "revenue"
                  )
                }
                className={`rounded-[1.5rem] p-5 border transition-all ${
                  type ===
                  "revenue"
                    ? "bg-green-500 text-white border-green-500 shadow-lg"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                }`}
              >

                <div className="flex flex-col items-center gap-3">

                  <ArrowDownCircle className="w-7 h-7" />

                  <span className="font-bold">
                    {t.revenue}
                  </span>

                </div>

              </button>

              <button
                type="button"
                onClick={() =>
                  setType(
                    "expense"
                  )
                }
                className={`rounded-[1.5rem] p-5 border transition-all ${
                  type ===
                  "expense"
                    ? "bg-red-500 text-white border-red-500 shadow-lg"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                }`}
              >

                <div className="flex flex-col items-center gap-3">

                  <ArrowUpCircle className="w-7 h-7" />

                  <span className="font-bold">
                    {t.expenses}
                  </span>

                </div>

              </button>

            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="space-y-4">

          <button
            type="submit"
            className="relative overflow-hidden w-full rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white py-5 font-black text-lg shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

            <div className="relative z-10 flex items-center justify-center gap-3">

              <Plus className="w-6 h-6" />

              {t.saveTransaction}

            </div>

          </button>

          <button
            type="button"
            onClick={() =>
              setShowSmsImport(true)
            }
            className="w-full rounded-[2rem] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-5 font-bold text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
          >
            {t.importFromSms}
          </button>

        </div>

      </form>

      {/* SMS POPUP */}

      {
        showSmsImport && (

          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl">

              {/* TOP GRADIENT */}

              <div className="sticky top-0 z-10 h-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setShowSmsImport(false)
                }
                className="sticky top-4 float-right mr-4 mt-4 z-20 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >

                <X size={20} />

              </button>

              {/* CONTENT */}

              <div className="p-6 pt-16">

                <SmsImport />

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}
