"use client"

import { useState } from "react";
import { useDebtStore } from "@/store/debt-store";
import { createDebt } from "@/lib/debts";

export default function AddDebtForm() {
    const addDebt =

        useDebtStore(
            (state) =>
                state.addDebt
        );




    const [name, setName] =
        useState("");
    const [amount, setAmount] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        await createDebt({
            name,

            amount: Number(amount),

            status: "pending",
        });

        addDebt({
            id: crypto.randomUUID(),
            name,
            amount: Number(amount),
            status: "pending",

            createdAt:
                new Date().toISOString(),
        });

        setName("");
        setAmount("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border rounded-2x1 p-5  space-y-4"
        >
            <h2 className="text -x1 font-bold text-rose-950">
                Add Debt
            </h2>

            <div>
                <label>
                    Person Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                    className="ocean-input" />
            </div>
            <div>
                <label>Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                        setAmount(
                            e.target.value
                        )
                    }
                    className="ocean-input"
                />
            </div>
            <button
                type="submit"
                className="oean-button touch-manipulation"
            >
                Add Debt
            </button>
        </form>
    );
}