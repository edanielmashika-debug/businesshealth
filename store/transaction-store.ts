import { create } from "zustand";

import { persist } from "zustand/middleware";

import { Transaction } from "@/types/transaction";

interface TransactionStore {
  transactions: Transaction[];

  addTransaction: (
    transaction: Transaction
  ) => void;

  deleteTransaction: (
    id: string,
  ) => void;

  setTransactions: (
    transactions: Transaction[]
  ) => void;
}

export const useTransactionStore =
  create<TransactionStore>()(
    persist(
      (set) => ({
        transactions: [],

        addTransaction: (
          transaction
        ) =>
          set((state) => ({
            transactions: [
              transaction,
              ...state.transactions,
            ],
          })),

        deleteTransaction: (id) =>
          set((state) => ({
            transactions:
              state.transactions.filter(
                (transaction) =>
                  transaction.id !== id
              ),
          })),

        setTransactions: (
          transactions
        ) =>
          set({
            transactions,
          }),
      }),
      {
        name: "transaction-storage",
      }
    )
  );