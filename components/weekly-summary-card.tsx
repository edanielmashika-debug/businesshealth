"use client";

import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

export default function WeeklySummaryCard({
  revenue,
  expenses,
  profit,
  lowStockCount,
  pendingDebts,
  aiSummary,
}: {
  revenue: number;
  expenses: number;
  profit: number;
  lowStockCount: number;
  pendingDebts: number;
  aiSummary?: string;
}) {
  const isProfitPositive = profit >= 0;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 22,
        background: "#0f1117",
        border: "1px solid #7c3aed22",
        padding: "24px",
        backgroundImage:
          "radial-gradient(ellipse at top right, #7c3aed14 0%, transparent 55%), radial-gradient(ellipse at bottom left, #a855f708 0%, transparent 50%)",
        boxShadow: "0 0 60px #7c3aed0a",
      }}
    >
      {/* GRID TEXTURE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            background: "#7c3aed18",
            border: "1px solid #7c3aed33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px #7c3aed22",
          }}
        >
          <Sparkles size={18} color="#c4b5fd" />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            Weekly AI Summary
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Smart overview of your business performance
          </p>
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#06ffa5",
            boxShadow: "0 0 8px #06ffa5",
          }}
        />
      </div>

      {/* GRID */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {/* REVENUE */}
        <div
          style={{
            borderRadius: 15,
            background: "#06ffa508",
            border: "1px solid #06ffa514",
            padding: "16px 18px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Revenue
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#06ffa5", marginTop: 6, letterSpacing: "-0.02em" }}>
            TZS {revenue.toLocaleString()}
          </h3>
        </div>

        {/* EXPENSES */}
        <div
          style={{
            borderRadius: 15,
            background: "#f8717108",
            border: "1px solid #f8717114",
            padding: "16px 18px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Expenses
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f87171", marginTop: 6, letterSpacing: "-0.02em" }}>
            TZS {expenses.toLocaleString()}
          </h3>
        </div>

        {/* PROFIT */}
        <div
          style={{
            borderRadius: 15,
            background: "#7c3aed0a",
            border: "1px solid #7c3aed1a",
            padding: "16px 18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            {isProfitPositive ? (
              <TrendingUp size={13} color="#06ffa5" />
            ) : (
              <TrendingDown size={13} color="#f87171" />
            )}
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Est. Profit
            </p>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: isProfitPositive ? "#06ffa5" : "#f87171", letterSpacing: "-0.02em" }}>
            TZS {profit.toLocaleString()}
          </h3>
        </div>

        {/* ALERTS */}
        <div
          style={{
            borderRadius: 15,
            background: "#ffffff04",
            border: "1px solid #ffffff08",
            padding: "16px 18px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Business Alerts
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              <span style={{ color: "#f87171", fontWeight: 700 }}>{lowStockCount}</span> low stock items
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>
              <span style={{ color: "#facc15", fontWeight: 700 }}>{pendingDebts}</span> pending debts
            </p>
          </div>
        </div>
      </div>

      {/* AI SUMMARY */}
      {aiSummary && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 10,
            borderRadius: 15,
            background: "#7c3aed08",
            border: "1px solid #7c3aed1a",
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Sparkles size={12} color="#c4b5fd" />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              AI Summary
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{aiSummary}</p>
        </div>
      )}
    </div>
  );
}
