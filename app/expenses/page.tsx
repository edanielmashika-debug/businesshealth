"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
  useExpenseStore,
} from "../../store/expense-store";

export default function ExpensesPage() {

  const {
    expenses,
    addExpense,
    deleteExpense,
    fetchExpenses,
  } =
    useExpenseStore();

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !title ||
      !amount ||
      !category
    )
      return;

    await addExpense({
      id: crypto.randomUUID(),

      title,

      amount:
        Number(amount),

      category,

      createdAt:
        new Date().toISOString(),
    });

    setTitle("");
    setAmount("");
    setCategory("");
  };

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        expense.amount,
      0
    );

  return (
    <DashboardLayout>

      <div className="space-y-8">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Expenses
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Track business spending
          </p>
        </div>

        {/* TOP CARD */}

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">

          <p className="text-sm opacity-80">
            Total Expenses
          </p>

          <h2 className="text-4xl font-bold mt-2">
            TZS{" "}
            {totalExpenses.toLocaleString()}
          </h2>
        </div>

        {/* FORM */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Expense
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Record business expenses
            </p>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Expense title"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl py-4 font-semibold"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* EXPENSE LIST */}

        <div className="space-y-4">

          {expenses.map(
            (expense) => (
              <div
                key={
                  expense.id
                }
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-slate-700"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {
                        expense.title
                      }
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {
                        expense.category
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-red-500">
                      TZS{" "}
                      {expense.amount.toLocaleString()}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {new Date(
                        expense.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteExpense(
                      expense.id
                    )
                  }
                  className="mt-4 text-red-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}