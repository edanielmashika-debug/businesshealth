"use client";

import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useEffect } from "react";
import { Transaction } from "../types/transaction";
import { getTransactions, deleteTransactionFromDB } from "../services/transaction-service";
import { useTransactionStore } from "../store/transaction-store";

type TransactionCardProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
};

export default function TransactionCard({ transaction, onDelete }: TransactionCardProps) {
  const isRevenue = transaction.type === "revenue";
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const setTransactions = useTransactionStore((state) => state.setTransactions);

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

    async function handleDelete(id: string) {
      deleteTransaction(id);
      await deleteTransactionFromDB(id);
    }

    loadTransactions();
  }, []);

  const accentColor = isRevenue ? "#06ffa5" : "#f87171";
  const accentBg = isRevenue ? "#06ffa508" : "#f8717108";
  const accentBorder = isRevenue ? "#06ffa518" : "#f8717118";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0f1117",
        border: "1px solid #ffffff0d",
        borderRadius: 18,
        padding: "18px 20px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}22`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${accentColor}0a`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.06,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: accentBg,
              border: `1px solid ${accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              flexShrink: 0,
            }}
          >
            {isRevenue ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
          </div>

          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
              {transaction.title}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {[
                { label: transaction.type, color: accentColor, bg: accentBg, border: accentBorder },
                { label: transaction.category, color: "#94a3b8", bg: "#ffffff06", border: "#ffffff0d" },
                ...(transaction.source ? [{ label: transaction.source, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" }] : []),
              ].map((tag) => (
                <span
                  key={tag.label}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 600,
                    color: tag.color,
                    background: tag.bg,
                    border: `1px solid ${tag.border}`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Amount
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: accentColor, marginTop: 4, letterSpacing: "-0.02em" }}>
            TZS {transaction.amount.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, color: "#4b5563", fontWeight: 500 }}>
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(transaction.id)}
          style={{
            padding: "5px 12px",
            borderRadius: 9,
            background: "#ef444408",
            border: "1px solid #ef444420",
            color: "#f87171",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#ef444418")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#ef444408")
          }
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}
