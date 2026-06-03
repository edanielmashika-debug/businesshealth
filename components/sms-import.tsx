"use client";

import { useState } from "react";

import {
  useTransactionStore,
} from "@/store/transaction-store";

import {
  createTransaction,
} from "@/services/transaction-service";

import {
  Smartphone,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

export default function SMSImport() {

  const addTransaction =
    useTransactionStore(
      (state) =>
        state.addTransaction
    );

  const [sms, setSms] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleImport() {

    if (!sms) return;

    setLoading(true);

    try {

      let type:
        | "revenue"
        | "expense" =
        "expense";

      if (
        sms
          .toLowerCase()
          .includes("received")
      ) {
        type = "revenue";
      }

      const amountMatch =
        sms.match(
          /(?:TZS|Ksh|KES)?\s?([\d,]+)/i
        );

      const amount =
        amountMatch
          ? Number(
              amountMatch[1].replace(
                /,/g,
                ""
              )
            )
          : 0;

      const provider =
        sms.includes("M-Pesa")
          ? "M-Pesa"
          : sms.includes(
              "Airtel"
            )
          ? "Airtel Money"
          : sms.includes(
              "Tigo"
            )
          ? "Tigo Pesa"
          : "Mobile Money";

      const transaction = {

        id: crypto.randomUUID(),

        title: provider,

        amount,

        category:
          "Mobile Money",

        type,

        source: "sms" as const,

        createdAt:
          new Date().toISOString(),
      };

      addTransaction(
        transaction
      );

      await createTransaction(
        transaction
      );

      setSms("");

    } catch (error) {

      console.error(error);

      alert(
        "Failed to import SMS"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">

      <div className="flex items-center gap-4 mb-6">

        <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-2xl">

          <Smartphone className="w-6 h-6 text-blue-600" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            SMS Import
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Paste mobile money SMS to auto record transactions
          </p>

        </div>
      </div>

      <textarea
        value={sms}
        onChange={(e) =>
          setSms(
            e.target.value
          )
        }
        placeholder="Paste M-Pesa, Airtel Money or Tigo Pesa SMS..."
        className="w-full h-40 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-4 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <ArrowDownCircle className="w-5 h-5 text-green-600" />

            <p className="text-sm text-green-600">
              Revenue SMS
            </p>

          </div>

          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Detects received payments automatically
          </p>

        </div>

        <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4">

          <div className="flex items-center gap-3">

            <ArrowUpCircle className="w-5 h-5 text-red-600" />

            <p className="text-sm text-red-600">
              Expense SMS
            </p>

          </div>

          <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
            Detects spending and withdrawals automatically
          </p>

        </div>
      </div>

      <button
        onClick={
          handleImport
        }
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white rounded-2xl py-4 font-semibold transition"
      >

        {loading
          ? "Importing..."
          : "Import SMS"}

      </button>
    </div>
  );
}