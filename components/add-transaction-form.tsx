"use client";

import { useState } from "react";

import { useTransactionStore } from "@/store/transaction-store";
import { createTransaction } from "@/services/transaction-service";

export default function AddTransactionForm() {
  const addTransaction =
    useTransactionStore(
      (state) => state.addTransaction
    );

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [type, setType] =
    useState("income");
  


  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    const newTransaction = {
      id: crypto.randomUUID(),

      amount: Number(amount),

      category,

      type: type as
        | "income"
        | "expense",

      paymentMethod: "cash" as const,

      createdAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);

    await createTransaction(
      newTransaction
    );
    setAmount("");
    setCategory("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-2xl p-5 space-y-4"
    >
      <h2 className="text-xl font-bold">
        Add Transaction
      </h2>

      <div>
        <label className="text-sm">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="5000"
        />
      </div>

      <div>
        <label className="text-sm">
          Category
        </label>

        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full border rounded-lg p-3 mt-1"
          placeholder="Food"
        />
      </div>

      <div>
        <label className="text-sm">
          Type
        </label>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full border rounded-lg p-3 mt-1"
        >
          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-3 rounded-lg w-full"
      >
        Save Transaction
      </button>
    </form>
  );
}