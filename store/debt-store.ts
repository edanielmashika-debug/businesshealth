import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Debt } from "@/types/debt";

interface DebtStore {
    debts: Debt[];

    addDebt: (
        debt: Debt

    ) => void;

    deleteDebt: (
        id: string
    ) => void;

    setDebts: (
        debts: Debt[]
    ) => void;

    markPaid: (
        id: string
    ) => void;

}

export const useDebtStore =
    create<DebtStore>()(
        persist(
            (set) => (
                {
                    debts: [],

                    addDebt: (debt) =>
                        set((state) => ({
                            debts: [
                                debt,
                                ...state.debts,
                            ],
                        })),

                    markPaid: (id) =>
                        set((state) => ({
                            debts:
                                state.debts.map(
                                    (debt) =>
                                        debt.id === id
                                            ? {
                                                ...debt,
                                                status:
                                                    "paid",

                                            }
                                            : debt
                                ),
                        })),

                    deleteDebt: (id) =>
                        set((state) => ({
                            debts:
                                state.debts.filter(
                                    (debt) =>
                                        debt.id !== id
                                ),
                        })),

                    setDebts: (debts) =>
                        set({
                            debts,
                        }),
                }),


            {
                name: "debt-storage",
            }
        )
    );