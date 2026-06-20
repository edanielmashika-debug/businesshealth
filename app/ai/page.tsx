"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 I'm Nova AI. Ask me anything about your sales, inventory, debts, expenses, profits, or business growth.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const customerdebts = useCustomerDebtStore((state) => state.debts);
  const fetchSales = useSalesStore((state) => state.fetchSales);
  useEffect(() => { fetchSales(); }, [fetchSales]);

  const sales = useSalesStore((state) => state.sales || []);
  const expenses = useExpenseStore((state) => state.expenses || []);
  const debts = useDebtStore((state) => state.debts || []);
  const products = useInventoryStore((state) => state.products || []);

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const debtAnalytics = {
    totalDebts: customerdebts.length,
    outstandingDebt: customerdebts.reduce((sum, debt) => sum + (debt.amount - debt.paid_amount), 0),
    totalDebtIssued: customerdebts.reduce((sum, debt) => sum + debt.amount, 0),
    totalCollected: customerdebts.reduce((sum, debt) => sum + debt.paid_amount, 0),
    overdueDebts: customerdebts.filter((debt) => debt.status !== "paid" && debt.due_date && new Date(debt.due_date) < new Date()).length,
    unpaidCustomers: customerdebts.filter((debt) => debt.status !== "paid").length,
    topDebtors: customerdebts.map((debt) => ({ customer: debt.customer_name, remaining: debt.amount - debt.paid_amount })).sort((a, b) => b.remaining - a.remaining).slice(0, 5),
  };
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const totalDebts = debts.reduce((sum, debt) => sum + Number(debt.amount || 0), 0);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          customerdebts: [{ customer_name: "John", amount: 150000, paid_amount: 50000, status: "partial", due_date: "2026-06-20" }],
          businessData: { totalSales, totalExpenses, totalDebts, lowStockProducts: lowStockCount, sales, expenses, debts, customerdebts: debtAnalytics, products },
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "No response from AI." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
  }

  return (
    <DashboardLayout>
      <div style={{ position: "relative", height: "calc(100vh - 88px)", overflow: "hidden" }}>

        {/* HEADER */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            zIndex: 20,
            height: 80,
            background: "#0a0b14",
            borderBottom: "1px solid #ffffff08",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px #7c3aed44",
              flexShrink: 0,
            }}
          >
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
              Nova AI
            </h1>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{t.businessAssistant}</p>
          </div>
          {/* Live indicator */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#06ffa5", boxShadow: "0 0 8px #06ffa5" }} />
            <span style={{ fontSize: 11, color: "#06ffa5", fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          style={{
            position: "absolute",
            top: 80,
            bottom: 76,
            left: 0,
            right: 0,
            overflowY: "auto",
            padding: "20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "12px 16px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "#161822",
                  border: msg.role === "user" ? "none" : "1px solid #ffffff0d",
                  color: "#f0f0ff",
                  boxShadow: msg.role === "user" ? "0 4px 16px #7c3aed33" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  {msg.role === "user"
                    ? <User size={12} style={{ opacity: 0.7 }} />
                    : <Bot size={12} color="#c4b5fd" />
                  }
                  <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {msg.role === "user" ? "You" : "Nova AI"}
                  </span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#e2e8f0" }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#161822",
                  border: "1px solid #7c3aed22",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Sparkles size={14} color="#c4b5fd" style={{ animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT BAR */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            zIndex: 30,
            borderTop: "1px solid #ffffff08",
            background: "#07080fee",
            backdropFilter: "blur(20px)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.askAi}
            style={{
              flex: 1,
              borderRadius: 13,
              border: "1px solid #ffffff0d",
              background: "#161822",
              padding: "12px 16px",
              fontSize: 13,
              color: "#f0f0ff",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.15s ease",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#7c3aed55"; }}
            onBlur={(e) => { e.target.style.borderColor = "#ffffff0d"; }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: loading ? "#7c3aed55" : "linear-gradient(135deg, #7c3aed, #a855f7)",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px #7c3aed44",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
