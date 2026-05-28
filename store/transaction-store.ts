import { create } from "zustand";

import { persist } from "zustand/middleware";

import { Transaction } from "@/types/transaction";
import { deleteTransactionFromDB } from "@/lib/transactions";

interface TransactionStore {
  transactions: Transaction[];

  addTransaction: (
    transaction: Transaction
  ) => void;

  deleteTransaction: (
    id: string,
  ) => Promise<void>;

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

        deleteTransaction: async(id) =>
          {
  set((state) => ({
    transactions:
      state.transactions.filter(
        (transaction) =>
          transaction.id !== id
      ),
  }));

  await deleteTransactionFromDB(
    id
  );
},
          

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