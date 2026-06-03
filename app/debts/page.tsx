"use client";

import {
  useEffect,
} from "react";

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
} from "lucide-react";

export default function DebtsPage() {

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

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Debts
          </h1>

          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Track customer debts and repayments
          </p>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TOTAL */}

          <div className="bg-gradient-to-br from-red-500 to-rose-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Total Debt
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  TZS{" "}
                  {totalDebt.toLocaleString()}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <Wallet />
              </div>
            </div>
          </div>

          {/* PAID */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Paid Debts
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {paidDebts.length}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <CheckCircle2 />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Pending Debts
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {pendingDebts.length}
                </h2>
              </div>

              <div className="bg-white/20 p-3 rounded-2xl">
                <Clock3 />
              </div>
            </div>
          </div>
        </div>

        {/* ADD FORM */}

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Debt
            </h2>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Record money owed by customers
            </p>
          </div>

          <AddDebtForm />
        </div>

        {/* DEBT LIST */}

        <div className="grid gap-5">

          {debts.map((debt) => (

            <div
              key={debt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 hover:shadow-md transition"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT */}

                <div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {debt.name}
                  </h2>

                  <p className="text-gray-500 dark:text-slate-400 mt-2">
                    Debt Record
                  </p>

                  <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-4">
                    TZS{" "}
                    {debt.amount.toLocaleString()}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    {new Date(
                      debt.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-start md:items-end gap-3">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      debt.status ===
                      "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                    }`}
                  >
                    {debt.status ===
                    "paid"
                      ? "Paid"
                      : "Pending"}
                  </span>

                  {debt.status ===
                    "pending" && (

                    <button
                      onClick={() =>
                        handleMarkPaid(
                          debt.id
                        )
                      }
                      className="flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-5 py-3 rounded-2xl font-semibold transition hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="w-4 h-4" />

                      Mark Paid
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(
                        debt.id
                      )
                    }
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" />

                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {debts.length === 0 && (

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 p-10 text-center">

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                No debts recorded
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Start by adding your first customer debt
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}