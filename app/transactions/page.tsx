"use client";

import DashboardLayout from "@/components/dashboard-layout";
import AddTransactionForm from "@/components/add-transaction-form";
import TransactionList from "@/components/transaction-list";
import { useEffect, useState } from "react";
import { getTransactions, deleteTransactionFromDB } from "@/services/transaction-service";
import { Plus, X } from "lucide-react";
import { useTransactionStore } from "@/store/transaction-store";
import { useTranslation } from "@/hooks/useTranslation";

export default function TransactionsPage() {
  const t = useTranslation();
  const { totalRevenue, totalExpenses, netBalance } = useTransactionStore();
  const transactions = useTransactionStore((state) => state.transactions);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadTransactions() {
      const data = await getTransactions();
      if (!data) return;
      const formatted = data.map((transaction: any) => ({
        id: transaction.id,
        title: transaction.title,
        amount: Number(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        source: transaction.source,
        createdAt: transaction.created_at,
      }));
      setTransactions(formatted);
    }
    loadTransactions();
  }, []);

  const statCards = [
    { label: t.revenue, value: `TZS ${totalRevenue().toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514" },
    { label: t.expenses, value: `TZS ${totalExpenses().toLocaleString()}`, color: "#f87171", bg: "#f8717108", border: "#f8717114" },
    { label: t.netBalance, value: `TZS ${netBalance().toLocaleString()}`, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            background: "#0f1117",
            border: "1px solid #7c3aed22",
            padding: "24px 26px",
            backgroundImage: "radial-gradient(ellipse at top right, #7c3aed12 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
            boxShadow: "0 0 60px #7c3aed08",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                💳 {t.transactions}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.cashflowDescription}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8 }}>{t.cashflowDescription}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 20px #7c3aed44",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#0f1117",
                border: `1px solid ${card.border}`,
                borderRadius: 16,
                padding: "18px 20px",
                backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: card.color, marginTop: 8, letterSpacing: "-0.03em" }}>{card.value}</h2>
            </div>
          ))}
        </div>

        {/* TRANSACTION LIST */}
        <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{t.recentTransactions}</h2>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.transactionHistory}</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#c4b5fd", background: "#7c3aed18", border: "1px solid #7c3aed33", padding: "4px 12px", borderRadius: 99 }}>
              {transactions.length} {t.records}
            </span>
          </div>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
      </div>

      {/* ADD FORM MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", overflowY: "auto" }}>
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px" }}>
            <div
              style={{
                width: "100%",
                maxWidth: 600,
                background: "#0f1117",
                borderRadius: 24,
                border: "1px solid #7c3aed33",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 0 80px #7c3aed22",
              }}
            >
              <div style={{ height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)" }} />
              <button
                onClick={() => setShowForm(false)}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  zIndex: 20,
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#ffffff08",
                  border: "1px solid #ffffff0d",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={15} />
              </button>
              <div style={{ maxHeight: "85vh", overflowY: "auto", padding: "14px 22px 28px" }}>
                <AddTransactionForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
