import { create } from "zustand";

import { persist } from "zustand/middleware";

import { Transaction } from "@/types/transaction";

import {
  deleteTransactionFromDB,
} from "@/lib/transactions";

import {
  useExpenseStore,
} from "./expense-store";

interface TransactionStore {

  transactions: Transaction[];

  addTransaction: (
    transaction: Transaction
  ) => void;

  deleteTransaction: (
    id: string
  ) => Promise<void>;

  setTransactions: (
    transactions: Transaction[]
  ) => void;

  totalRevenue: () => number;

  totalExpenses: () => number;

  netBalance: () => number;
}

export const useTransactionStore =
  create<TransactionStore>()(
    persist(
      (set, get) => ({

        transactions: [],

        addTransaction: (
          transaction
        ) => {

          set((state) => ({
            transactions: [
              transaction,
              ...state.transactions,
            ],
          }));

          /* AUTO SYNC EXPENSES */

          if (
            transaction.type ===
            "expense"
          ) {

            const expenseStore =
              useExpenseStore.getState();

            expenseStore.addExpense({
              id: crypto.randomUUID(),

              title:
                transaction.type,

              amount:
                transaction.amount,

              category:
                transaction.category,

              createdAt:
                transaction.createdAt,
            });
          }
        },

        deleteTransaction:
          async (id) => {

            set((state) => ({
              transactions:
                state.transactions.filter(
                  (
                    transaction
                  ) =>
                    transaction.id !==
                    id
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

        totalRevenue: () => {

          return get()
            .transactions
            .filter(
              (transaction) =>
                transaction.type ===
                "revenue"
            )
            .reduce(
              (
                sum,
                transaction
              ) =>
                sum +
                transaction.amount,
              0
            );
        },

        totalExpenses: () => {

          return get()
            .transactions
            .filter(
              (transaction) =>
                transaction.type ===
                "expense"
            )
            .reduce(
              (
                sum,
                transaction
              ) =>
                sum +
                transaction.amount,
              0
            );
        },

        netBalance: () => {

          return (
            get().totalRevenue() -
            get().totalExpenses()
          );
        },
      }),

      {
        name:
          "transaction-storage",
      }
    )
  );