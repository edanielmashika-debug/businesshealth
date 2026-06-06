"use client";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/dashboard-layout";

import {
  useExpenseStore,
} from "../../store/expense-store";

import {
  Plus,
  X,
  Wallet,
  TrendingDown,
  Receipt,
  Trash2,
  Sparkles,
} from "lucide-react";

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

  const [showForm, setShowForm] =
    useState(false);

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

    setShowForm(false);
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

  const categoriesCount =
    new Set(
      expenses.map(
        (expense) =>
          expense.category
      )
    ).size;

  return (

    <DashboardLayout>

      <div className="space-y-8 pb-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 p-8 lg:p-10 text-white shadow-2xl">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

                <Sparkles className="w-4 h-4" />

                Expense Tracker

              </div>

              <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">
                Business
                <br />
                Expenses
              </h1>

              <p className="text-red-100 mt-4 max-w-2xl text-lg">
                Monitor spending, control costs and track every business expense.
              </p>

            </div>

            {/* ADD BUTTON */}

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="w-20 h-20 rounded-[2rem] bg-white text-red-500 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
            >

              <Plus className="w-10 h-10" />

            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TOTAL */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Total Expenses
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-red-500">
                    TZS{" "}
                    {totalExpenses.toLocaleString()}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">

                  <Wallet className="w-7 h-7 text-red-500" />

                </div>

              </div>

            </div>

          </div>

          {/* TOTAL RECORDS */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Expense Records
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-orange-500">
                    {expenses.length}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">

                  <Receipt className="w-7 h-7 text-orange-500" />

                </div>

              </div>

            </div>

          </div>

          {/* CATEGORIES */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Categories
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-rose-500">
                    {categoriesCount}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">

                  <TrendingDown className="w-7 h-7 text-rose-500" />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* POPUP FORM */}

        {showForm && (

          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">

              {/* TOP BAR */}

              <div className="h-2 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />

              {/* CLOSE */}

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >

                <X size={20} />

              </button>

              {/* SCROLLABLE CONTENT */}

              <div className="overflow-y-auto p-6 md:p-8">

                <div className="mb-8">

                  <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">

                    <Receipt className="w-4 h-4" />

                    New Expense

                  </div>

                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-5">
                    Add Expense
                  </h2>

                  <p className="text-gray-500 dark:text-slate-400 mt-3">
                    Record business spending and categorize your expenses.
                  </p>

                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-6"
                >

                  {/* TITLE */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                      Expense Title
                    </label>

                    <input
                      type="text"
                      placeholder="Office Rent"
                      value={title}
                      onChange={(e) =>
                        setTitle(
                          e.target.value
                        )
                      }
                      className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                  {/* AMOUNT */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                      Amount
                    </label>

                    <div className="relative">

                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500 font-bold">
                        TZS
                      </span>

                      <input
                        type="number"
                        placeholder="50000"
                        value={amount}
                        onChange={(e) =>
                          setAmount(
                            e.target.value
                          )
                        }
                        className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-16 pr-5 py-5 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-400"
                      />

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                      Category
                    </label>

                    <input
                      type="text"
                      placeholder="Transport"
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value
                        )
                      }
                      className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 outline-none focus:ring-2 focus:ring-red-500 text-black dark:text-white placeholder:text-gray-400"
                    />

                  </div>

                  {/* PREVIEW */}

                  {(title ||
                    amount) && (

                    <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-[1.8rem] p-6 text-white shadow-lg">

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm opacity-80">
                            Expense Preview
                          </p>

                          <h3 className="text-2xl font-black mt-2">
                            {title ||
                              "Expense"}
                          </h3>

                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                          <Wallet className="w-7 h-7" />

                        </div>

                      </div>

                      <h2 className="text-4xl font-black mt-6">
                        TZS{" "}
                        {amount
                          ? Number(
                              amount
                            ).toLocaleString()
                          : "0"}
                      </h2>

                    </div>
                  )}

                  {/* BUTTON */}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 hover:scale-[1.01] active:scale-[0.99] text-white rounded-[1.5rem] py-5 font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >

                    <Plus className="w-5 h-5" />

                    Save Expense

                  </button>

                </form>

              </div>

            </div>

          </div>
        )}

        {/* EXPENSE LIST */}

        <div className="grid gap-5">

          {expenses.map(
            (expense) => (

              <div
                key={
                  expense.id
                }
                className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >

                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-center gap-3 flex-wrap">

                      <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                        {
                          expense.title
                        }
                      </h2>

                      <span className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
                        {
                          expense.category
                        }
                      </span>

                    </div>

                    <p className="text-gray-500 dark:text-slate-400 mt-4">
                      Expense transaction
                    </p>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
                      {new Date(
                        expense.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* RIGHT */}

                  <div className="flex flex-col items-start lg:items-end gap-4">

                    <h2 className="text-4xl font-black text-red-500">
                      TZS{" "}
                      {expense.amount.toLocaleString()}
                    </h2>

                    <button
                      onClick={() =>
                        deleteExpense(
                          expense.id
                        )
                      }
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all"
                    >

                      <Trash2 className="w-4 h-4" />

                      Delete

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

          {/* EMPTY STATE */}

          {expenses.length ===
            0 && (

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-700 p-14 text-center">

              <div className="text-6xl mb-5">
                💸
              </div>

              <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                No expenses yet
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
                Start recording your business spending and keep your finances organized.
              </p>

            </div>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}