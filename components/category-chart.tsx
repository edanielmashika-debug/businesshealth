"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTransactionStore } from "@/store/transaction-store";

export default function CategoryChart() {
    const transactions =
        useTransactionStore(
            (state) => state.transactions
        );

    const expenses =
        transactions.filter(
            (transactions) =>
                transactions.type === "expense"
        );
    const grouped =
        expenses.reduce(
            (acc, transaction) => {
                const existing =
                    acc.find(
                        (item) =>
                            item.category ===
                            transaction.category
                    );



                if (existing) {
                    existing.amount +=
                        transaction.amount;
                } else {
                    acc.push(
                        {
                            category:
                                transaction.category,

                            amount:
                                transaction.amount,
                        }
                    );
                }
                return acc;
            },
            [] as {
                category: string;
                amount: number;
            }[]
        );

    return (
        <div className="border round-2x1 p-5 ocean-general mt-6">
            <h2 className="text-x1 font bold-m4">
                Expense Categories
            </h2>

            <div className="h-[300px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart data={grouped}>
                        <XAxis dataKey="category"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar className="bg-white" dataKey="amount"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}