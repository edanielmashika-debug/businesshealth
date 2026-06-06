"use client";

import {
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import { useEffect } from "react";

import { Transaction } from "../types/transaction";
import {
  getTransactions,
  deleteTransactionFromDB,
} from "../services/transaction-service";

import {
  useTransactionStore,
} from "../store/transaction-store";

type TransactionCardProps = {
  transaction: Transaction;

  onDelete: (
    id: string
  ) => void;
};

export default function TransactionCard({
  transaction,
  onDelete,
}: TransactionCardProps) {

  const isRevenue =
    transaction.type ===
    "revenue";

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

  return (

    <div
      className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300"
    >

      {/* BACKGROUND GLOW */}

      <div
        className={`absolute top-0 right-0 w-40 h-40 blur-3xl opacity-10 rounded-full ${transaction.type === "revenue"
          ? "bg-green-500"
          : "bg-red-500"
          }`}
      />

      {/* TOP */}

      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* LEFT */}

        <div className="flex items-start gap-4">

          {/* ICON */}

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${transaction.type === "revenue"
              ? "bg-gradient-to-br from-green-500 to-emerald-700"
              : "bg-gradient-to-br from-red-500 to-rose-700"
              }`}
          >

            {transaction.type === "revenue"
              ? "↗"
              : "↘"}

          </div>

          {/* INFO */}

          <div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
              {transaction.title}
            </h2>

            <div className="flex items-center gap-2 mt-2 flex-wrap">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === "revenue"
                  ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                  }`}
              >
                {transaction.type}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                {transaction.category}
              </span>

              {transaction.source && (

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                  {transaction.source}
                </span>

              )}

            </div>

          </div>

        </div>

        {/* AMOUNT */}

        <div className="text-right">

          <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-slate-500 font-semibold">
            Amount
          </p>

          <h2
            className={`text-2xl md:text-3xl font-black mt-2 ${transaction.type === "revenue"
              ? "text-green-600 dark:text-green-400"
              : "text-red-500 dark:text-red-400"
              }`}
          >
            TZS{" "}
            {transaction.amount.toLocaleString()}
          </h2>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="relative z-10 mt-6 flex items-center justify-between gap-4 flex-wrap">

        {/* DATE */}

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">

          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            📅
          </div>

          <span>
            {new Date(
              transaction.createdAt
            ).toLocaleDateString()}
          </span>

        </div>

        {/* DELETE */}

        <button
          onClick={() =>
            onDelete(transaction.id)
          }
          className="px-5 py-2 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
        >
          <Trash2 size={16} />

          Delete
        </button>

      </div>

    </div>
  );
}


