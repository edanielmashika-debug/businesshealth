"use client";

import { useState } from "react";

import { useDebtStore } from "@/store/debt-store";

import { createDebt } from "@/lib/debts";
import { useTranslation } from "@/hooks/useTranslation";

import {
  Wallet,
  User,
  BadgeDollarSign,
  Plus,
  Sparkles,
} from "lucide-react";

export default function AddDebtForm() {
  const t = useTranslation();
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

    if (!name || !amount)
      return;

    await createDebt({
      name,

      amount:
        Number(amount),

      status: "pending",
    });

    addDebt({
      id: crypto.randomUUID(),

      name,

      amount:
        Number(amount),

      status: "pending",

      createdAt:
        new Date().toISOString(),
    });

    setName("");

    setAmount("");
  }

  return (

    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-sm">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 right-0 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 md:p-8">

        {/* HEADER */}

        <div className="mb-8">

          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-semibold">

            <Sparkles className="w-4 h-4" />

            {t.addDebtForm.debtRecord}

          </div>

          <h2 className="text-3xl font-black text-gray-800 dark:text-white mt-5">
            {t.addDebtForm.addNewDebt}
          </h2>

          <p className="text-gray-500 dark:text-slate-400 mt-3 leading-relaxed">
            {t.addDebtForm.description}
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NAME */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">

              <User className="w-4 h-4" />

              {t.addDebtForm.customerName}

            </label>

            <div className="relative">

              <input
                type="text"
                placeholder={t.addDebtForm.enterCustomerName}
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />

            </div>

          </div>

          {/* AMOUNT */}

          <div>

            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">

              <BadgeDollarSign className="w-4 h-4" />

              {t.addDebtForm.debtAmount}

            </label>

            <div className="relative">

              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 font-bold">
                TZS
              </div>

              <input
                type="number"
                placeholder="50000"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="w-full rounded-[1.5rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 pl-16 pr-5 py-5 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />

            </div>

          </div>

          {/* PREVIEW CARD */}

          {(name || amount) && (

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-[1.8rem] p-6 text-white shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm opacity-80">
                    {t.addDebtForm.pendingDebt}
                  </p>

                  <h3 className="text-2xl font-black mt-2">
                    {name || "Customer"}
                  </h3>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                  <Wallet className="w-7 h-7" />

                </div>

              </div>

              <h2 className="text-4xl font-black mt-6">
                TZS{" "}
                {amount
                  ? Number(
                      amount
                    ).toLocaleString()
                  : "0"}
              </h2>

            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:scale-[1.01] active:scale-[0.99] text-white rounded-[1.5rem] py-5 font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          >

            <Plus className="w-5 h-5" />

            {t.addDebtForm.saveDebt}

          </button>

        </form>

      </div>

    </div>
  );
}