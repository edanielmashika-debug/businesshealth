"use client";

import { useState } from "react";
import { useTransactionStore } from "@/store/transaction-store";
import { createTransaction } from "@/services/transaction-service";
import SmsImport from "@/components/sms-import";
import { useTranslation } from "@/hooks/useTranslation";
import { X, Plus, Wallet, ArrowDownCircle, ArrowUpCircle, Sparkles } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 13,
  border: "1px solid #ffffff0d",
  background: "#161822",
  padding: "13px 16px",
  fontSize: 14,
  color: "#f0f0ff",
  outline: "none",
  marginTop: 8,
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export default function AddTransactionForm() {
  const t = useTranslation();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"revenue" | "expense">("revenue");
  const [showSmsImport, setShowSmsImport] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || !category) return;
    const newTransaction = {
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      category,
      type,
      source: "manual" as const,
      createdAt: new Date().toISOString(),
    };
    addTransaction(newTransaction);
    await createTransaction(newTransaction);
    setTitle("");
    setAmount("");
    setCategory("");
    setType("revenue");
  }

  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#7c3aed66";
    e.target.style.boxShadow = "0 0 0 3px #7c3aed14";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#ffffff0d";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* HERO BANNER */}
        <div
          style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, #0f1117 0%, #161822 100%)",
            border: "1px solid #7c3aed33",
            padding: "22px 24px",
            backgroundImage:
              "radial-gradient(ellipse at top right, #7c3aed18 0%, transparent 60%)",
            boxShadow: "0 0 40px #7c3aed0a",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#7c3aed18",
              border: "1px solid #7c3aed33",
              color: "#c4b5fd",
              padding: "4px 10px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <Sparkles size={11} />
            {t.smartTransactions}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {t.add} {t.transaction}
              </h2>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>
                {t.transactionDescription}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                flexShrink: 0,
                boxShadow: "0 4px 16px #7c3aed33",
              }}
            >
              <Wallet size={20} />
            </div>
          </div>
        </div>

        {/* FORM FIELDS */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #ffffff0d",
            borderRadius: 20,
            padding: "22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <label style={labelStyle}>{t.transactionTitle}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Shop Sale" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </div>
          <div>
            <label style={labelStyle}>{t.amount}</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50000" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </div>
          <div>
            <label style={labelStyle}>{t.category}</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Sales" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
          </div>

          {/* TYPE TOGGLE */}
          <div>
            <label style={{ ...labelStyle, display: "block", marginBottom: 10 }}>{t.transactionType}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(["revenue", "expense"] as const).map((opt) => {
                const isActive = type === opt;
                const isRevenue = opt === "revenue";
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setType(opt)}
                    style={{
                      padding: "14px 10px",
                      borderRadius: 13,
                      border: isActive
                        ? `1px solid ${isRevenue ? "#06ffa533" : "#f8717133"}`
                        : "1px solid #ffffff0d",
                      background: isActive
                        ? isRevenue
                          ? "#06ffa514"
                          : "#ef444414"
                        : "#161822",
                      color: isActive
                        ? isRevenue ? "#06ffa5" : "#f87171"
                        : "#6b7280",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {isRevenue ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                    <span style={{ fontSize: 12, fontWeight: 700 }}>
                      {isRevenue ? t.revenue : t.expenses}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <button
          type="submit"
          style={{
            width: "100%",
            borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "#fff",
            padding: "14px 0",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 24px #7c3aed33",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px #7c3aed44";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px #7c3aed33";
          }}
        >
          <Plus size={16} />
          {t.saveTransaction}
        </button>

        <button
          type="button"
          onClick={() => setShowSmsImport(true)}
          style={{
            width: "100%",
            borderRadius: 14,
            border: "1px solid #ffffff0d",
            background: "#0f1117",
            padding: "13px 0",
            fontWeight: 600,
            fontSize: 13,
            color: "#c4b5fd",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed44";
            (e.currentTarget as HTMLElement).style.background = "#7c3aed0a";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d";
            (e.currentTarget as HTMLElement).style.background = "#0f1117";
          }}
        >
          {t.importFromSms}
        </button>
      </form>

      {/* SMS MODAL */}
      {showSmsImport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#0f1117",
              borderRadius: 24,
              border: "1px solid #7c3aed33",
              boxShadow: "0 0 80px #7c3aed22",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                height: 2,
                background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowSmsImport(false)}
              style={{
                position: "sticky",
                top: 12,
                float: "right",
                margin: "12px 16px 0 0",
                zIndex: 20,
                width: 36,
                height: 36,
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
              <X size={16} />
            </button>
            <div style={{ padding: "12px 24px 28px" }}>
              <SmsImport />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
