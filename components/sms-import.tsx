"use client";

import { useState } from "react";

import {
  useTransactionStore,
} from "@/store/transaction-store";

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

  return (

    <div className="space-y-4">

      <textarea
        value={sms}
        onChange={(e) =>
          setSms(
            e.target.value
          )
        }
        placeholder="Paste SMS message here..."
        className="w-full h-40 rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={
          handleImport
        }
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg"
      >
        Import SMS
      </button>
    </div>
  );
}