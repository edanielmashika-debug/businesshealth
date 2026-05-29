"use client";

import { useState } from "react";

import { parseMobileMoneySMS } from "@/utils/parse-mobile-money-sms";

import { useTransactionStore } from "@/store/transaction-store";

export default function SMSImport() {
  const [text, setText] =
    useState("");

  const addTransaction =
    useTransactionStore(
      (state) =>
        state.addTransaction
    );

  function handleParse() {
    const parsed =
      parseMobileMoneySMS(
        text
      );

    if (!parsed) {
      alert(
        "Could not parse SMS"
      );

      return;
    }

    addTransaction({
      id: crypto.randomUUID(),

      amount: parsed.amount,

      category:
        "Mobile Money",

      type: parsed.type,

      paymentMethod:
        parsed.provider,

      createdAt:
        new Date().toISOString(),
    });

    alert(
      "Transaction imported!"
    );

    setText("");
  }

  return (
    <div className="border rounded-2xl p-5 ocean-general mt-6">
      <h2 className="text-xl font-bold mb-4">
        Import SMS
      </h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(
            e.target.value
          )
        }
        placeholder="Paste M-Pesa SMS here..."
        className="w-full border rounded-xl p-3 h-40"
      />

      <button
        type="button"
        onClick={handleParse}
        className="mt-4 bg-black text-white px-5 py-3 rounded-xl"
      >
        Parse SMS
      </button>
    </div>
  );
}