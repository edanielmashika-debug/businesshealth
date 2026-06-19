"use client";

import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { useTranslation } from "@/hooks/useTranslation";

type TransactionListProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const t = useTranslation();

  if (transactions.length === 0) {
    return (
      <div
        style={{
          background: "#0f1117",
          border: "1px solid #ffffff0d",
          borderRadius: 22,
          padding: "56px 24px",
          textAlign: "center",
          backgroundImage:
            "radial-gradient(ellipse at center, #7c3aed08 0%, transparent 60%)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#f0f0ff",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          {t.transactionList.noTransactionsYet}
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>
          {t.transactionList.noTransactionsDescription}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {transactions.map((transaction) => {
        const isRevenue = transaction.type === "revenue";
        const accentColor = isRevenue ? "#06ffa5" : "#f87171";
        const accentBg = isRevenue ? "#06ffa508" : "#f8717108";
        const accentBorder = isRevenue ? "#06ffa518" : "#f8717118";

        return (
          <div
            key={transaction.id}
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
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}22`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d";
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
                opacity: 0.05,
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              {/* LEFT */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: accentBg,
                    border: `1px solid ${accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accentColor,
                    flexShrink: 0,
                  }}
                >
                  {isRevenue ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>
                    {transaction.title}
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {[
                      { label: transaction.type, color: accentColor, bg: accentBg, border: accentBorder },
                      { label: transaction.category, color: "#94a3b8", bg: "#ffffff06", border: "#ffffff0d" },
                      ...(transaction.source ? [{ label: transaction.source, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" }] : []),
                    ].map((tag) => (
                      <span
                        key={tag.label}
                        style={{
                          padding: "2px 9px",
                          borderRadius: 99,
                          fontSize: 10,
                          fontWeight: 700,
                          color: tag.color,
                          background: tag.bg,
                          border: `1px solid ${tag.border}`,
                          textTransform: "capitalize",
                        }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#4b5563", marginTop: 8 }}>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t.amount}
                  </p>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: accentColor, marginTop: 4, letterSpacing: "-0.02em" }}>
                    {isRevenue ? "+" : "-"}TZS {transaction.amount.toLocaleString()}
                  </h2>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#ef444408",
                    border: "1px solid #ef444420",
                    color: "#f87171",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#ef444418";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#ef444408";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
