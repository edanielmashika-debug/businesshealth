"use client";

import { useTransactionStore } from "@/store/transaction-store";

import TransactionCard from "./transaction-card";

export default function TransactionList() {
  const transactions =
    useTransactionStore(
      (state) => state.transactions
    );

  const deleteTransaction =
    useTransactionStore(
      (state) =>
        state.deleteTransaction
    );

  if (transactions.length === 0) {
    return (
      <div className="border rounded-2xl p-5">
        <div className="text-center py-10">
          <p className="text-gray-500">
            No transactions yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-4">
        Transactions
      </h2>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onDelete={deleteTransaction}
          />
        ))}
      </div>
    </div>
  );
}