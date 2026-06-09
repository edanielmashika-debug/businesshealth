"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
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

interface Props {
  sales?: any[];
  expenses?: any[];
  debts?: any[];
  products?: any[];
  onClose?: () => void;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AiChatbot() {

  /*
    STATES
  */

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "ai",

        text:
          "Hello 👋 I’m your AI business assistant. Ask me about profits, sales, inventory, expenses, or debts.",
      },
    ]);

  /*
    AUTO SCROLL
  */

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  /*
    BUSINESS DATA
  */

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
  /*
    SEND MESSAGE
  */

  async function handleSend() {

    if (
      !message.trim() ||
      loading
    )
      return;

    const userMessage =
      message;

    /*
      ADD USER MESSAGE
    */

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

      /*
        API REQUEST
      */

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

              message:
                userMessage,

              businessData: {

                totalSales,

                totalExpenses,

                totalDebts,

                lowStockProducts:
                  lowStockCount,

                products,

                expenses,

                debts,

                sales,
              },
            }),
          }
        );

      const data =
        await response.json();

      console.log(data);

      /*
        ERROR
      */

      if (!response.ok) {

        setMessages((prev) => [
          ...prev,
          {
            role: "ai",

            text:
              data.error ||
              "AI failed to respond.",
          },
        ]);

        setLoading(false);

        return;
      }

      /*
        AI RESPONSE
      */

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",

          text:
            data.reply ||
            "No response.",
        },
      ]);

    } catch (error) {

      console.log(error);

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

  /*
    ENTER KEY
  */

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      handleSend();
    }
  }

  return (

    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-3xl h-[90vh] bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white">

              <Sparkles />

            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Nova AI
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400">
                Smart business assistant
              </p>

            </div>
          </div>

          <button
           
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-black dark:text-white hover:scale-110 transition"
          >

            <X size={18} />

          </button>
        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-gray-50 dark:bg-slate-900">

          {messages.map(
            (
              msg,
              index
            ) => (

              <div
                key={index}
                className={`flex ${
                  msg.role ===
                  "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm ${
                    msg.role ===
                    "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "bg-white dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-slate-700"
                  }`}
                >

                  <div className="flex items-center gap-2 mb-2">

                    {msg.role ===
                    "user" ? (

                      <User
                        size={16}
                      />

                    ) : (

                      <Bot
                        size={16}
                      />

                    )}

                    <span className="text-xs font-semibold opacity-70">

                      {msg.role ===
                      "user"
                        ? "You"
                        : "Nova AI"}

                    </span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {msg.text}
                  </p>

                </div>
              </div>
            )
          )}

          {/* LOADING */}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl px-5 py-4 shadow-sm">

                <div className="flex items-center gap-3">

                  <Bot
                    size={16}
                  />

                  <span className="text-sm text-gray-600 dark:text-slate-300">
                    AI is thinking...
                  </span>

                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <div className="p-5 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">

          <div className="flex items-center gap-3">

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask AI about your business..."
              className="flex-1 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
            />

            <button
              onClick={
                handleSend
              }
              disabled={
                loading
              }
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50"
            >

              <Send size={20} />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
