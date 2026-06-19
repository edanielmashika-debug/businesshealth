"use client";

import { useState, useEffect } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { useSalesStore } from "../store/sales-store";
import { useExpenseStore } from "../store/expense-store";
import { useDebtStore } from "../store/debt-store";
import { useInventoryStore } from "../store/inventory-store";

export default function AiChatBot() {
  const fetchSales = useSalesStore((state) => state.fetchSales);
  useEffect(() => { fetchSales(); }, []);

  const sales = useSalesStore((state) => state.sales || []);
  const expenses = useExpenseStore((state) => state.expenses || []);
  const debts = useDebtStore((state) => state.debts || []);
  const products = useInventoryStore((state) => state.products || []);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const totalDebts = debts.reduce((sum, debt) => sum + Number(debt.amount || 0), 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  async function handleAsk() {
    if (!message) return;
    try {
      setLoading(true);
      setResponse("");
      const businessData = {
        totalSales, totalExpenses, totalDebts, lowStockCount,
        productsCount: products.length, salesCount: sales.length,
        expensesCount: expenses.length, debtsCount: debts.length,
      };
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, businessData }),
      });
      const data = await res.json();
      setResponse(data.reply || "No response from AI.");
    } catch (error) {
      console.log(error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#0f1117",
        border: "1px solid #ffffff0d",
        borderRadius: 22,
        padding: "24px",
        backgroundImage:
          "radial-gradient(ellipse at top right, #7c3aed0a 0%, transparent 55%)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px #7c3aed44",
            flexShrink: 0,
          }}
        >
          <Bot size={22} color="#fff" />
        </div>
        <div>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: "#f0f0ff",
              letterSpacing: "-0.02em",
            }}
          >
            Nova AI Assistant
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Analyze your business with AI
          </p>
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#06ffa5",
            boxShadow: "0 0 8px #06ffa5",
          }}
        />
      </div>

      {/* TEXTAREA */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Nova anything about your business..."
        style={{
          width: "100%",
          height: 120,
          borderRadius: 14,
          border: "1px solid #ffffff0d",
          background: "#161822",
          padding: "14px 16px",
          fontSize: 13,
          color: "#f0f0ff",
          outline: "none",
          resize: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
          lineHeight: 1.6,
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#7c3aed55"; }}
        onBlur={(e) => { e.target.style.borderColor = "#ffffff0d"; }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 12,
          borderRadius: 13,
          background: loading
            ? "#7c3aed55"
            : "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff",
          padding: "13px 0",
          fontWeight: 700,
          fontSize: 13,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: loading ? "none" : "0 4px 20px #7c3aed33",
          transition: "all 0.15s ease",
        }}
      >
        {loading ? (
          <>
            <Sparkles size={15} style={{ animation: "pulse 1s infinite" }} />
            Thinking...
          </>
        ) : (
          <>
            <Send size={15} />
            Ask AI
          </>
        )}
      </button>

      {/* RESPONSE */}
      {response && (
        <div
          style={{
            marginTop: 16,
            background: "#161822",
            border: "1px solid #7c3aed22",
            borderRadius: 16,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Sparkles size={14} color="#c4b5fd" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#c4b5fd",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Nova Response
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
