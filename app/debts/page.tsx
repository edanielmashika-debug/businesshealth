"use client";

import DashboardLayout from "@/components/dashboard-layout";

import AddDebtForm from "@/components/add-debt-form";

import { useDebtStore } from "@/store/debt-store";
import { useEffect } from "react";
import { getDebts } from "@/lib/debts";
import {
    updateDebtStatus,
    deleteDebtFromDB,
} from "@/lib/debts";

export default function DebtsPage() {
    const debts =
        useDebtStore(
            (state) => state.debts
        );

    const setDebts =
        useDebtStore(
            (state) =>
                state.setDebts
        );

    const markPaid =
        useDebtStore(
            (state) =>
                state.markPaid
        );

    const deleteDebt =
        useDebtStore(
            (state) =>
                state.deleteDebt
        );

    useEffect(() => {
        async function loadDebts() {
            const data =
                await getDebts();

            if (!data) return;

            const formatted =
                data.map((debt) => ({
                    id: debt.id,

                    name: debt.name,

                    amount: Number(
                        debt.amount
                    ),

                    status:
                        debt.status as
                        | "pending"
                        | "paid",

                    createdAt:
                        debt.created_at,
                }));

            setDebts(formatted);
        }

        loadDebts();
    }, [setDebts]);


    async function handleMarkPaid(
        id: string
    ) {
        markPaid(id);

        await updateDebtStatus(
            id,
            "paid"
        );
    }

    async function handleDelete(
        id: string
    ) {
        deleteDebt(id);

        await deleteDebtFromDB(id);
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Debts
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track money owed
                    </p>
                </div>

                <AddDebtForm />

                <div className="grid gap-4">
                    {debts.map((debt) => (
                        <div
                            key={debt.id}
                            className="border rounded-2xl p-5 bg-white"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-bold text-lg">
                                        {debt.name}
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        TZS {debt.amount}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${debt.status ===
                                            "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {debt.status}
                                    </span>

                                    {debt.status ===
                                        "pending" && (
                                            <button
                                                onClick={() =>
                                                    handleMarkPaid(
                                                        debt.id
                                                    )
                                                }
                                                className="text-sm bg-black text-white px-3 py-2 rounded-lg touch-manipulation"
                                            >
                                                Mark Paid
                                            </button>
                                        )}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                debt.id
                                            )
                                        }
                                        className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg touch-manipulation"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}