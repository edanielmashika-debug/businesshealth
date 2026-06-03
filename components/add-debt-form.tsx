"use client";

import { useState } from "react";

import { useDebtStore } from "@/store/debt-store";

import { createDebt } from "@/lib/debts";

export default function AddDebtForm() {

  const addDebt =
    useDebtStore(
      (state) =>
        state.addDebt
    );

  const [name, setName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!name || !amount)
      return;

    await createDebt({
      name,

      amount:
        Number(amount),

      status: "pending",
    });

    addDebt({
      id: crypto.randomUUID(),

      name,

      amount:
        Number(amount),

      status: "pending",

      createdAt:
        new Date().toISOString(),
    });

    setName("");

    setAmount("");
  }

  return (

    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add Debt
        </h2>

        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Record customer or supplier debts
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* NAME */}

        <div>

          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Person Name
          </label>

          <input
            type="text"
            placeholder="Enter customer name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* AMOUNT */}

        <div>

          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter debt amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl py-4 font-semibold shadow-lg transition"
        >
          Add Debt
        </button>
      </form>
    </div>
  );
}