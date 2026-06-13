"use client";

import {
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import { useLanguageStore } from "@/store/language-store";

import { Transaction } from "@/types/transaction";
import { useTranslation } from "@/hooks/useTranslation";

type TransactionListProps = {
  transactions: Transaction[];

  onDelete: (
    id: string
  ) => void;
};

export default function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
    const t = useTranslation();
  if (
    transactions.length === 0
  ) {

    return (

      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 p-12 text-center shadow-sm">

        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">

          <div className="text-7xl mb-6">
            💳
          </div>

          <h2 className="text-3xl font-black text-gray-800 dark:text-white">
            {t.transactionList.noTransactionsYet}
          </h2>

          <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-md mx-auto text-lg">
            {t.transactionList.noTransactionsDescription}
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="space-y-5">

      {transactions.map(
        (transaction) => {

          const isRevenue =
            transaction.type ===
            "revenue";

          return (

            <div
              key={transaction.id}
              className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* GLOW */}

              <div
                className={`absolute top-0 right-0 w-56 h-56 blur-3xl opacity-10 rounded-full ${
                  isRevenue
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* LEFT SIDE */}

                <div className="flex items-start gap-5">

                  {/* ICON */}

                  <div
                    className={`w-16 h-16 rounded-[1.3rem] flex items-center justify-center shadow-lg ${
                      isRevenue
                        ? "bg-gradient-to-br from-green-500 to-emerald-700"
                        : "bg-gradient-to-br from-red-500 to-rose-700"
                    }`}
                  >

                    {isRevenue ? (

                      <ArrowDownCircle className="w-8 h-8 text-white" />

                    ) : (

                      <ArrowUpCircle className="w-8 h-8 text-white" />

                    )}

                  </div>

                  {/* DETAILS */}

                  <div>

                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                      {transaction.title}
                    </h2>

                    {/* TAGS */}

                    <div className="flex flex-wrap items-center gap-2 mt-3">

                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                          isRevenue
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                        }`}
                      >
                        {transaction.type}
                      </span>

                      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {transaction.category}
                      </span>

                      {transaction.source && (

                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                          {transaction.source}
                        </span>

                      )}

                    </div>

                    {/* DATE */}

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-slate-400">

                      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                        📅
                      </div>

                      <span>
                        {new Date(
                          transaction.createdAt
                        ).toLocaleString()}
                      </span>

                    </div>

                  </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-5">

                  {/* AMOUNT */}

                  <div className="text-left lg:text-right">

                    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-bold">
                      {t.amount}
                    </p>

                    <h2
                      className={`text-3xl font-black mt-2 ${
                        isRevenue
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {isRevenue
                        ? "+"
                        : "-"}

                      TZS{" "}

                      {transaction.amount.toLocaleString()}
                    </h2>

                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      onDelete(
                        transaction.id
                      )
                    }
                    className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-all hover:scale-110"
                  >

                    <Trash2 className="w-5 h-5" />

                  </button>

                </div>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}