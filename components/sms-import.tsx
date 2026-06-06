"use client";

import { useState } from "react";

import {
  useTransactionStore,
} from "@/store/transaction-store";

import {
  Sparkles,
  Smartphone,
  CheckCircle2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

export default function SmsImport() {

  const addTransaction =
    useTransactionStore(
      (state) =>
        state.addTransaction
    );

  const [sms, setSms] =
    useState("");

  function extractAmount(
    text: string
  ) {

    const match =
      text.match(
        /(\d[\d,]*)/
      );

    if (!match)
      return 0;

    return Number(
      match[0].replace(
        /,/g,
        ""
      )
    );
  }

  function detectProvider(
    text: string
  ) {

    const lower =
      text.toLowerCase();

    if (
      lower.includes(
        "mpesa"
      )
    ) {
      return "M-Pesa";
    }

    if (
      lower.includes(
        "airtel"
      )
    ) {
      return "Airtel Money";
    }

    if (
      lower.includes(
        "tigopesa"
      )
    ) {
      return "Tigo Pesa";
    }

    if (
      lower.includes(
        "halopesa"
      )
    ) {
      return "HaloPesa";
    }

    return "Mobile Money";
  }

  function handleImport() {

    if (!sms)
      return;

    const lowerMessage =
      sms.toLowerCase();

    const isRevenue =

      lowerMessage.includes(
        "received"
      ) ||

      lowerMessage.includes(
        "umepokea"
      ) ||

      lowerMessage.includes(
        "cash received"
      ) ||

      lowerMessage.includes(
        "paid to you"
      );

    const isExpense =

      lowerMessage.includes(
        "sent"
      ) ||

      lowerMessage.includes(
        "umetuma"
      ) ||

      lowerMessage.includes(
        "umetoa"
      ) ||

      lowerMessage.includes(
        "payment"
      ) ||

      lowerMessage.includes(
        "withdraw"
      ) ||

      lowerMessage.includes(
        "withdrawn"
      );

    const type:
      "revenue" | "expense" =
      isRevenue
        ? "revenue"
        : "expense";

    const amount =
      extractAmount(
        sms
      );

    const provider =
      detectProvider(
        sms
      );

    addTransaction({

      id:
        crypto.randomUUID(),

      title:
        provider,

      amount,

      category:
        "Mobile Money",

      type,

      source:
        "sms" as const,

      createdAt:
        new Date().toISOString(),
    });

    setSms("");
  }

  const detectedProvider =
    sms
      ? detectProvider(
          sms
        )
      : null;

  const detectedAmount =
    sms
      ? extractAmount(
          sms
        )
      : 0;

  const detectedType =
    sms.toLowerCase().includes(
      "received"
    ) ||
    sms.toLowerCase().includes(
      "umepokea"
    )
      ? "revenue"
      : sms
      ? "expense"
      : null;

  return (

    <div className="space-y-6">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-6 text-white shadow-xl">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

        <div className="relative z-10 flex items-start justify-between gap-4">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold">

              <Sparkles className="w-4 h-4" />

              Smart SMS Import

            </div>

            <h2 className="text-3xl font-black mt-5 leading-tight">
              Paste Mobile
              <br />
              Money SMS
            </h2>

            <p className="text-blue-100 mt-3 max-w-xl">
              Automatically extract amount, provider, and transaction type from SMS messages.
            </p>

          </div>

          <div className="hidden md:flex w-16 h-16 rounded-3xl bg-white text-blue-700 items-center justify-center shadow-2xl">

            <Smartphone size={30} />

          </div>

        </div>

      </div>

      {/* TEXTAREA */}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              SMS Message
            </h3>

            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Paste the full mobile money message below
            </p>

          </div>

          <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-2xl text-sm font-semibold">
            Auto Detect
          </div>

        </div>

        <textarea
          value={sms}
          onChange={(e) =>
            setSms(
              e.target.value
            )
          }
          placeholder="Example:
Umepokea TZS 50,000 kutoka kwa John kupitia M-Pesa..."
          className="w-full h-52 rounded-[2rem] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-5 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
        />

      </div>

      {/* DETECTED PREVIEW */}

      {
        sms && (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* PROVIDER */}

            <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm">

              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Provider
                </p>

                <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-3">
                  {detectedProvider}
                </h2>

              </div>

            </div>

            {/* AMOUNT */}

            <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm">

              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Amount
                </p>

                <h2 className="text-2xl font-black text-green-600 mt-3">
                  TZS{" "}
                  {detectedAmount.toLocaleString()}
                </h2>

              </div>

            </div>

            {/* TYPE */}

            <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm">

              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
                  detectedType ===
                  "revenue"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              />

              <div className="relative z-10">

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Transaction Type
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      detectedType ===
                      "revenue"
                        ? "bg-green-100 dark:bg-green-500/20 text-green-600"
                        : "bg-red-100 dark:bg-red-500/20 text-red-600"
                    }`}
                  >

                    {detectedType ===
                    "revenue" ? (

                      <ArrowDownCircle className="w-6 h-6" />

                    ) : (

                      <ArrowUpCircle className="w-6 h-6" />

                    )}

                  </div>

                  <h2
                    className={`text-xl font-black capitalize ${
                      detectedType ===
                      "revenue"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {detectedType}
                  </h2>

                </div>

              </div>

            </div>

          </div>
        )
      }

      {/* IMPORT BUTTON */}

      <button
        onClick={
          handleImport
        }
        className="relative overflow-hidden w-full rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white py-5 font-black text-lg shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
      >

        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

        <div className="relative z-10 flex items-center justify-center gap-3">

          <CheckCircle2 className="w-6 h-6" />

          Import Transaction

        </div>

      </button>

    </div>
  );
}
