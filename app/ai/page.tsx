"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard-layout";

import { useSalesStore } from "../../store/sales-store";
import { useExpenseStore } from "../../store/expense-store";
import { useDebtStore } from "../../store/debt-store";
import { useInventoryStore } from "../../store/inventory-store";
import { useCustomerDebtStore } from "../../store/customer-debt-store";
import { useTranslation } from "../../hooks/useTranslation";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AiChatbotPage() {
  const [message, setMessage] = useState("");

  const t = useTranslation();

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "ai",
        text: "Hello 👋 I'm Nova AI. Ask me anything about your sales, inventory, debts, expenses, profits, or business growth.",
      },
    ]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  /* LOAD DATA */

  const customerdebts =
    useCustomerDebtStore(
      (state) => state.debts
    );
  const fetchSales =
    useSalesStore(
      (state) => state.fetchSales
    );

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const sales =
    useSalesStore(
      (state) => state.sales || []
    );

  const expenses =
    useExpenseStore(
      (state) => state.expenses || []
    );

  const debts =
    useDebtStore(
      (state) => state.debts || []
    );

  const products =
    useInventoryStore(
      (state) => state.products || []
    );

  /* BUSINESS DATA */

  const totalSales =
    sales.reduce(
      (sum, sale) =>
        sum + Number(sale.total || 0),
      0
    );

  const debtAnalytics = {
    totalDebts: debts.length,

    outstandingDebt: debts.reduce(
      (sum, debt) =>
        sum +
        (debt.amount -
          debt.paid_amount),
      0
    ),

    totalDebtIssued:
      debts.reduce(
        (sum, debt) =>
          sum + debt.amount,
        0
      ),

    totalCollected:
      debts.reduce(
        (sum, debt) =>
          sum +
          debt.paid_amount,
        0
      ),

    overdueDebts:
      debts.filter(
        (debt) =>
          debt.status !== "paid" &&
          debt.due_date &&
          new Date(debt.due_date) <
          new Date()
      ).length,

    unpaidCustomers:
      debts.filter(
        (debt) =>
          debt.status !== "paid"
      ).length,

    topDebtors: debts
      .map((debt) => ({
        customer:
          debt.customer_name,

        remaining:
          debt.amount -
          debt.paid_amount,
      }))
      .sort(
        (a, b) =>
          b.remaining -
          a.remaining
      )
      .slice(0, 5),
  };
  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(expense.amount || 0),
      0
    );

  const totalDebts =
    debts.reduce(
      (sum, debt) =>
        sum + Number(debt.amount || 0),
      0
    );

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock <= 5
    ).length;

  /* AUTO SCROLL */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* SEND */

  async function handleSend() {
    if (!message.trim() || loading)
      return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/ai-chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: userMessage,
              debts:
                [
                  {
                    customer_name: "John",
                    amount: 150000,
                    paid_amount: 50000,
                    status: "partial",
                    due_date: "2026-06-20"
                  }
                ],

              businessData: {
                totalSales,

                totalExpenses,

                totalDebts,

                lowStockProducts:
                  lowStockCount,

                sales,

                expenses,

                debts,

                customerdebts: debtAnalytics,

                products,
              },
            }),
          }
        );

      const data =
        await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            "No response from AI.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Something went wrong connecting to AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSend();
    }
  }

  return (
    <DashboardLayout>
      <div className="relative h-[calc(100vh-80px)] overflow-hidden">

        {/* HEADER */}

        <div className="absolute top-0 left-0 right-0 z-20 h-32 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 flex items-center px-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">

              <Bot className="w-8 h-8" />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nova AI
              </h1>

              <p className="text-gray-500 dark:text-slate-400">
                {t.businessAssistant}
              </p>

            </div>

          </div>

        </div>

        {/* CHAT AREA */}

        <div className="absolute top-32 bottom-24 left-0 right-0 overflow-y-auto px-5 py-6 space-y-5">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`flex ${msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-100"
                    }`}
                >

                  <div className="flex items-center gap-2 mb-2">

                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}

                    <span className="text-xs opacity-70">

                      {msg.role ===
                        "user"
                        ? "You"
                        : "Nova AI"}

                    </span>

                  </div>

                  <p className="whitespace-pre-wrap leading-7">
                    {msg.text}
                  </p>

                </div>

              </div>
            )
          )}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl px-5 py-4 text-gray-800 dark:text-white">

                <div className="flex items-center gap-2">

                  <Sparkles className="w-4 h-4 animate-pulse" />

                  AI is thinking...

                </div>

              </div>

            </div>
          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}

        <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-5">

          <div className="flex items-center gap-3">

            <input
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder={t.askAi}
              className="flex-1 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={
                handleSend
              }
              disabled={loading}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50"
            >

              <Send size={20} />

            </button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
