import { create } from "zustand";

import { supabase } from "@/lib/supabase";

export type Expense = {
  id: string;

  title: string;

  amount: number;

  category: string;

  createdAt: string;
};

type ExpenseStore = {

  expenses: Expense[];

  fetchExpenses: () => Promise<void>;

  addExpense: (
    expense: Expense
  ) => Promise<void>;

  deleteExpense: (
    id: string
  ) => Promise<void>;

  setExpenses: (
    expenses: Expense[]
  ) => void;
};

export const useExpenseStore =
  create<ExpenseStore>(
    (set, get) => ({

      expenses: [],

      fetchExpenses:
        async () => {

          const {
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) return;

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "expenses"
              )
              .select("*")
              .eq(
                "user_id",
                user.id
              )
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
              );

          if (
            error ||
            !data
          ) {
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
                id:
                  expense.id,

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
            data: { user },
          } =
            await supabase.auth.getUser();

          if (!user) return;

          const {
            error,
          } =
            await supabase
              .from(
                "expenses"
              )
              .insert({
                id:
                  expense.id,

                title:
                  expense.title,

                amount:
                  expense.amount,

                category:
                  expense.category,

                created_at:
                  expense.createdAt,

                user_id:
                  user.id,
              });

          if (error) {
            console.error(
              error
            );

            return;
          }

          set({
            expenses: [
              expense,
              ...get()
                .expenses,
            ],
          });
        },

      deleteExpense:
        async (
          id
        ) => {

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

          set({
            expenses:
              get().expenses.filter(
                (
                  expense
                ) =>
                  expense.id !==
                  id
              ),
          });
        },

      setExpenses:
        (
          expenses
        ) => {

          set({
            expenses,
          });
        },
    })
  );