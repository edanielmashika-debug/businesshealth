"use client";

import { create } from "zustand";

import { supabase } from "../lib/supabase";

export type Expense = {
  id: string;

  title: string;

  amount: number;

  category: string;

  createdAt: string;
};

type ExpenseStore = {
  expenses: Expense[];

  addExpense: (
    expense: Expense
  ) => Promise<void>;

  deleteExpense: (
    id: string
  ) => Promise<void>;

  fetchExpenses: () => Promise<void>;
};

export const useExpenseStore =
  create<ExpenseStore>(
    (set) => ({
      expenses: [],

      fetchExpenses:
        async () => {

          const {
            data,
            error,
          } =
            await supabase
              .from("expenses")
              .select("*")
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
              );

          if (error) {
            console.error(
              error
            );

            return;
          }

          const formatted =
            data.map(
              (
                expense
              ) => ({
                id: expense.id,

                title:
                  expense.title,

                amount:
                  Number(
                    expense.amount
                  ),

                category:
                  expense.category,

                createdAt:
                  expense.created_at,
              })
            );

          set({
            expenses:
              formatted,
          });
        },

      addExpense:
        async (
          expense
        ) => {

          const {
            error,
          } =
            await supabase
              .from(
                "expenses"
              )
              .insert({
                id: expense.id,

                title:
                  expense.title,

                amount:
                  expense.amount,

                category:
                  expense.category,

                created_at:
                  expense.createdAt,
              });

          if (error) {
            console.error(
              error
            );

            return;
          }

          set((state) => ({
            expenses: [
              expense,
              ...state.expenses,
            ],
          }));
        },

      deleteExpense:
        async (id) => {

          const {
            error,
          } =
            await supabase
              .from(
                "expenses"
              )
              .delete()
              .eq(
                "id",
                id
              );

          if (error) {
            console.error(
              error
            );

            return;
          }

          set((state) => ({
            expenses:
              state.expenses.filter(
                (
                  expense
                ) =>
                  expense.id !==
                  id
              ),
          }));
        },
    })
  );