"use client";

import {
  useEffect,
  useState,
} from "react";

import {useTranslation} from "../../hooks/useTranslation";


import DashboardLayout from "@/components/dashboard-layout";

import AddDebtForm from "@/components/add-debt-form";

import {
  useDebtStore,
} from "@/store/debt-store";

import {
  getDebts,
  updateDebtStatus,
  deleteDebtFromDB,
} from "@/lib/debts";

import {
  Wallet,
  CheckCircle2,
  Clock3,
  Trash2,
  Plus,
  X,
  BadgeDollarSign,
  Sparkles,
} from "lucide-react";

export default function DebtsPage() {
  const t = useTranslation();
  const debts =
    useDebtStore(
      (state) => state.debts
    );

  const setDebts =
    useDebtStore(
      (state) =>
        state.setDebts
    );

  const markPaid =
    useDebtStore(
      (state) =>
        state.markPaid
    );

  const deleteDebt =
    useDebtStore(
      (state) =>
        state.deleteDebt
    );

  const [showForm, setShowForm] =
    useState(false);

  useEffect(() => {

    async function loadDebts() {

      const data =
        await getDebts();

      if (!data) return;

      const formatted =
        data.map((debt) => ({
          id: debt.id,

          name: debt.name,

          amount: Number(
            debt.amount
          ),

          status:
            debt.status as
              | "pending"
              | "paid",

          createdAt:
            debt.created_at,
        }));

      setDebts(formatted);
    }

    loadDebts();

  }, [setDebts]);

  async function handleMarkPaid(
    id: string
  ) {

    markPaid(id);

    await updateDebtStatus(
      id,
      "paid"
    );
  }

  async function handleDelete(
    id: string
  ) {

    deleteDebt(id);

    await deleteDebtFromDB(id);
  }

  const totalDebt =
    debts.reduce(
      (sum, debt) =>
        sum + debt.amount,
      0
    );

  const paidDebts =
    debts.filter(
      (debt) =>
        debt.status === "paid"
    );

  const pendingDebts =
    debts.filter(
      (debt) =>
        debt.status === "pending"
    );

  return (

    <DashboardLayout>

      <div className="space-y-8 pb-10">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 p-8 lg:p-10 text-white shadow-2xl">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">

                <Sparkles className="w-4 h-4" />

                {t.debts.debtTracking}

              </div>

              <h1 className="text-4xl lg:text-5xl font-black mt-5 leading-tight">
                {t.debts.customer}
                <br />
                {t.debts.Debts}
              </h1>

              <p className="text-orange-100 mt-4 max-w-2xl text-lg">
                {t.debts.customerDebtsDescription}
              </p>

            </div>

            {/* ADD BUTTON */}

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="w-20 h-20 rounded-[2rem] bg-white text-orange-600 shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
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
                    {t.debts.totalDebt}
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-red-500">
                    TZS{" "}
                    {totalDebt.toLocaleString()}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">

                  <Wallet className="w-7 h-7 text-red-500" />

                </div>

              </div>

            </div>

          </div>

          {/* PAID */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    {t.debts.paidDebts}
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-green-600">
                    {paidDebts.length}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">

                  <CheckCircle2 className="w-7 h-7 text-green-600" />

                </div>

              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition">

            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    {t.debts.pendingDebts}
                  </p>

                  <h2 className="text-4xl font-black mt-3 text-yellow-500">
                    {pendingDebts.length}
                  </h2>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">

                  <Clock3 className="w-7 h-7 text-yellow-500" />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* POPUP */}

        {showForm && (

          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">

              {/* TOP BAR */}

              <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500" />

              {/* CLOSE */}

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 text-black dark:text-white flex items-center justify-center hover:scale-110 transition"
              >

                <X className="w-5 h-5" />

              </button>

              {/* SCROLL AREA */}

              <div className="overflow-y-auto p-6">

                <div className="mb-6">

                  <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold">

                    <BadgeDollarSign className="w-4 h-4" />

                    {t.debts.addNewDebt}

                  </div>

                  <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-4">
                    {t.debts.recordCustomerDebt}
                  </h2>

                  <p className="text-gray-500 dark:text-slate-400 mt-2">
                    {t.debts.recordCustomerDebtDescription}
                  </p>

                </div>

                <AddDebtForm />

              </div>

            </div>

          </div>
        )}

        {/* DEBT LIST */}

        <div className="grid gap-6">

          {debts.map((debt) => (

            <div
              key={debt.id}
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT */}

                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                      {debt.name}
                    </h2>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        debt.status ===
                        "paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300"
                      }`}
                    >
                      {debt.status ===
                      "paid"
                        ? "Paid"
                        : "Pending"}
                    </span>

                  </div>

                  <p className="text-gray-500 dark:text-slate-400 mt-3">
                    {t.debts.customerDebtRecord}
                  </p>

                  <h3 className="text-4xl font-black text-orange-500 mt-5">
                    TZS{" "}
                    {debt.amount.toLocaleString()}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
                    Added on{" "}
                    {new Date(
                      debt.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-col gap-3 w-full lg:w-auto">

                  {debt.status ===
                    "pending" && (

                    <button
                      onClick={() =>
                        handleMarkPaid(
                          debt.id
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-black dark:bg-white dark:text-black text-white px-6 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all"
                    >

                      <CheckCircle2 className="w-5 h-5" />

                      {t.debts.markAsPaid}

                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(
                        debt.id
                      )
                    }
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all"
                  >

                    <Trash2 className="w-5 h-5" />

                    {t.debts.deleteDebt}

                  </button>

                </div>

              </div>

            </div>
          ))}

          {/* EMPTY */}

          {debts.length === 0 && (

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-700 p-14 text-center">

              <div className="text-6xl mb-5">
                💰
              </div>

              <h2 className="text-3xl font-black text-gray-800 dark:text-white">
                {t.debts.noDebtsRecorded}
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
                  {t.debts.noDebtsRecordedDescription}
              </p>

            </div>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}