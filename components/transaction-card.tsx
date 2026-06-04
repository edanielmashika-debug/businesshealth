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

    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-start justify-between gap-4">

        {/* LEFT */}

        <div className="flex items-start gap-4">

          <div
            className={`p-3 rounded-2xl ${isRevenue
              ? "bg-green-100 dark:bg-green-500/20"
              : "bg-red-100 dark:bg-red-500/20"
              }`}
          >

            {isRevenue ? (

              <ArrowDownCircle className="w-6 h-6 text-green-600" />

            ) : (

              <ArrowUpCircle className="w-6 h-6 text-red-600" />

            )}

          </div>

          <div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {transaction.title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {transaction.category}
            </p>

            <div className="flex items-center gap-2 mt-3">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${isRevenue
                  ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  }`}
              >
                {transaction.type}
              </span>

              {transaction.source && (

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 capitalize">

                  {transaction.source}

                </span>

              )}

            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-col items-end gap-4">

          <div className="text-right">

            <p className="text-sm text-gray-500 dark:text-slate-400">
              Amount
            </p>

            <h2
              className={`text-2xl font-bold mt-1 ${isRevenue
                ? "text-green-600"
                : "text-red-600"
                }`}
            >

              {isRevenue
                ? "+"
                : "-"}

              TZS{" "}

              {transaction.amount.toLocaleString()}

            </h2>

            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">

              {new Date(
                transaction.createdAt
              ).toLocaleDateString()}

            </p>
          </div>

          <button
            onClick={() =>
              onDelete(
                transaction.id
              )
            }
            className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 rounded-2xl px-4 py-2 transition flex items-center gap-2 text-sm font-semibold"
          >

            <Trash2 size={16} />

            Delete

          </button>
        </div>
      </div>
    </div>
  );
}