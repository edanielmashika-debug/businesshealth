"use client";

import {
  useState,
  useEffect,
} from "react";



import {
  Bot,
  Send,
  Sparkles,
} from "lucide-react";

import {
  useSalesStore,
} from "../../store/sales-store";

import {
  useExpenseStore,
} from "../../store/expense-store";

import {
  useDebtStore,
} from "../../store/debt-store";

import {
  useInventoryStore,
} from "../../store/inventory-store";

export default function AiChatBot() {


const fetchSales =
  useSalesStore(
    (state) =>
      state.fetchSales
  );

useEffect(() => {
  fetchSales();
}, []);



const sales =
  useSalesStore(
    (state) =>
      state.sales || []
  );





  const expenses =
    useExpenseStore(
      (state) =>
        state.expenses || []
    );

  const debts =
    useDebtStore(
      (state) =>
        state.debts || []
    );

  const products =
    useInventoryStore(
      (state) =>
        state.products || []
    );

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [response, setResponse] =
    useState("");

  /* TOTALS */

  const totalSales =
    sales.reduce(
      (
        sum,
        sale
      ) =>
        sum +
        Number(
          sale.total ||
          0
        ),
      0
    );

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  const totalDebts =
    debts.reduce(
      (
        sum,
        debt
      ) =>
        sum +
        Number(
          debt.amount || 0
        ),
      0
    );

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock <= 5
    ).length;

  async function handleAsk() {

    if (!message) return;

    try {

      setLoading(true);

      setResponse("");

      const businessData = {

        totalSales,

        totalExpenses,

        totalDebts,

        lowStockCount,

        productsCount:
          products.length,

        salesCount:
          sales.length,

        expensesCount:
          expenses.length,

        debtsCount:
          debts.length,
      };

      const res =
        await fetch(
          "/api/ai-chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,

              businessData,
            }),
          }
        );

      const data =
        await res.json();

      setResponse(
        data.reply ||
          "No response from AI."
      );

    } catch (error) {

      console.log(error);

      setResponse(
        "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-6">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">

          <Bot className="w-7 h-7" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Nova AI Assistant
          </h2>

          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Analyze your business with AI
          </p>

        </div>

      </div>

      {/* INPUT */}

      <div className="space-y-4">

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Ask Nova AI anything about your business..."
          className="w-full h-36 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl py-4 font-semibold shadow-lg hover:scale-[1.01] transition flex items-center justify-center gap-3 disabled:opacity-60"
        >

          {loading ? (

            <>
              <Sparkles className="w-5 h-5 animate-pulse" />

              AI is thinking...
            </>

          ) : (

            <>
              <Send className="w-5 h-5" />

              Ask AI
            </>
          )}

        </button>

      </div>

      {/* RESPONSE */}

      {response && (

        <div className="mt-6 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-3xl p-5">

          <div className="flex items-center gap-2 mb-3">

            <Sparkles className="w-5 h-5 text-blue-600" />

            <h3 className="font-bold text-blue-700 dark:text-cyan-400">
              Nova AI Response
            </h3>

          </div>

          <p className="text-gray-700 dark:text-slate-300 leading-7 whitespace-pre-wrap">
            {response}
          </p>

        </div>
      )}

    </div>
  );
}
