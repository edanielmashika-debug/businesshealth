import { create } from "zustand";

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
  ) => void;

  deleteExpense: (
    id: string
  ) => void;
};

export const useExpenseStore =
  create<ExpenseStore>(
    (set) => ({
      expenses: [],

      addExpense: (
        expense
      ) =>
        set((state) => ({
          expenses: [
            expense,
            ...state.expenses,
          ],
        })),

      deleteExpense: (
        id
      ) =>
        set((state) => ({
          expenses:
            state.expenses.filter(
              (
                expense
              ) =>
                expense.id !==
                id
            ),
        })),
    })
  );