"use client";

import { Trash2 } from "lucide-react";

import { Transaction } from "@/types/transaction";

type TransactionCardProps = {
  transaction: Transaction;

  onDelete: (id: string) => void;
};

export default function TransactionCard({
  transaction,
  onDelete,
}: TransactionCardProps) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-4">
      <div>
        <h3 className="font-semibold">
          {transaction.category}
        </h3>

        <p className="text-sm text-gray-500 capitalize">
          {transaction.type}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p
          className={`font-bold ${
            transaction.type === "income"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          TZS {transaction.amount}
        </p>

        <button
          onClick={() =>
            onDelete(transaction.id)
          }
          className="text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}