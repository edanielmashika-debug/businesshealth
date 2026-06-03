"use client";

import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Transaction } from "@/types/transaction";

type TransactionListProps = {
  transactions: Transaction[];

  onDelete: (id: string) => void;
};

export default function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-10 text-center shadow-sm">
        <div className="text-5xl mb-4">
          💳
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Transactions Yet
        </h2>

        <p className="text-gray-500 dark:text-slate-400 mt-2">
          Your imported SMS and manual transactions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map(
        (transaction) => {
          const isRevenue =
            transaction.type ===
            "revenue";

          return (
            <div
              key={transaction.id}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  
                  <div
                    className={`p-3 rounded-2xl ${
                      isRevenue
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
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {transaction.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          isRevenue
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>

                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 px-3 py-1 rounded-full">
                        {transaction.category}
                      </span>

                      {transaction.source && (
                        <span className="text-xs bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1 rounded-full">
                          {transaction.source}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-4">
                  
                  <h2
                    className={`text-2xl font-bold ${
                      isRevenue
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isRevenue ? "+" : "-"}
                    TZS{" "}
                    {transaction.amount.toLocaleString()}
                  </h2>

                  <button
                    onClick={() =>
                      onDelete(
                        transaction.id
                      )
                    }
                    className="bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 p-3 rounded-2xl transition"
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