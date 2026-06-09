"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import DashboardLayout from "../../components/dashboard-layout";


import { useSalesStore } from "../../store/sales-store";
import { useExpenseStore } from "../../store/expense-store";
import { useDebtStore } from "../../store/debt-store";
import { useInventoryStore } from "../../store/inventory-store";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AiChatbotPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 I’m your AI business assistant. Ask me about profits, sales, inventory, expenses, or debts.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSales = useSalesStore((state) => state.fetchSales);

  useEffect(() => {
    fetchSales();
  }, []);

  const sales = useSalesStore((state) => state.sales || []);
  const expenses = useExpenseStore((state) => state.expenses || []);
  const debts = useDebtStore((state) => state.debts || []);
  const products = useInventoryStore((state) => state.products || []);

  const totalSales = sales.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalDebts = debts.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  async function handleSend() {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          businessData: {
            totalSales,
            totalExpenses,
            totalDebts,
            lowStockProducts: lowStockCount,
            products,
            expenses,
            debts,
            sales,
          },
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.ok ? data.reply : data.error || "AI failed to respond.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong connecting to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

return (
  <DashboardLayout>
    <div className="h-screen bg-gray-50 dark:bg-slate-950 relative overflow-hidden">

      {/* HEADER (FIXED TOP) */}
      <div className="fixed top-[80px]0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white">
            <Sparkles />
          </div>

          <div>
            <h2 className="text-xl font-bold">Nova AI</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Smart business assistant
            </p>
          </div>
        </div>
      </div>

      {/* CHAT AREA (ONLY SCROLLABLE) */}
      <div className="absolute top-[160px] bottom-[110px] left-0 right-0 overflow-y-auto px-5 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                <span className="text-xs opacity-70">
                  {msg.role === "user" ? "You" : "Nova AI"}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border rounded-3xl px-5 py-4">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT (FIXED BOTTOM) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-5 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center gap-3">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI about your business..."
            className="flex-1 rounded-2xl border px-5 py-4 bg-gray-50 dark:bg-slate-900 outline-none"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>

        </div>
      </div>

    </div>
  </DashboardLayout>
);
}