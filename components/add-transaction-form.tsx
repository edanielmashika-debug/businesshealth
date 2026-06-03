"use client";

import { useState } from "react";

import { useTransactionStore } from "@/store/transaction-store";

import { createTransaction } from "@/services/transaction-service";

import { useExpenseStore } from "@/store/expense-store";

export default function AddTransactionForm() {

  const addTransaction =
    useTransactionStore(
      (state) => state.addTransaction
    );

  const addExpense =
    useExpenseStore(
      (state) => state.addExpense
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

      id: crypto.randomUUID(),

      title,

      amount:
        Number(amount),

      category,

      type,

      source: "manual" as const,

      createdAt:
        new Date().toISOString(),
    };

    addTransaction(
      newTransaction
    );

    await createTransaction(
      newTransaction
    );

    /*
      AUTO SYNC TO EXPENSES
    */

    if (type === "expense") {

      addExpense({
        id: crypto.randomUUID(),

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
    setType("revenue");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-5"
    >

      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add Transaction
        </h2>

        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Record revenue and expenses
        </p>
      </div>

      {/* TITLE */}

      <div>

        <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
          Title
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
          className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* AMOUNT */}

      <div>

        <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
          Amount
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
          className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* CATEGORY */}

      <div>

        <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
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
          className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* TYPE */}

      <div>

        <label className="text-sm font-medium text-gray-600 dark:text-slate-300">
          Transaction Type
        </label>

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target
                .value as
                | "revenue"
                | "expense"
            )
          }
          className="w-full mt-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white"
        >

          <option value="revenue">
            Revenue
          </option>

          <option value="expense">
            Expense
          </option>
        </select>
      </div>

      {/* BUTTON */}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold hover:scale-[1.01] transition"
      >
        Save Transaction
      </button>
    </form>
  );
}