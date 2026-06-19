"use client";

import { useState } from "react";
import { useDebtStore } from "@/store/debt-store";
import { createDebt } from "@/lib/debts";
import { useTranslation } from "@/hooks/useTranslation";
import { Wallet, User, BadgeDollarSign, Plus, Sparkles } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #ffffff0d",
  background: "#161822",
  padding: "14px 18px",
  fontSize: 14,
  color: "#f0f0ff",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

export default function AddDebtForm() {
  const t = useTranslation();
  const addDebt = useDebtStore((state) => state.addDebt);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount) return;
    await createDebt({ name, amount: Number(amount), status: "pending" });
    addDebt({
      id: crypto.randomUUID(),
      name,
      amount: Number(amount),
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setName("");
    setAmount("");
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0f1117",
        borderRadius: 24,
        border: "1px solid #ffffff0d",
        backgroundImage:
          "radial-gradient(ellipse at top right, #7c3aed0a 0%, transparent 55%), radial-gradient(ellipse at bottom left, #a855f706 0%, transparent 50%)",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 32px" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#7c3aed18",
              border: "1px solid #7c3aed33",
              color: "#c4b5fd",
              padding: "5px 12px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <Sparkles size={12} />
            {t.addDebtForm.debtRecord}
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#f0f0ff",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {t.addDebtForm.addNewDebt}
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
            {t.addDebtForm.description}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* NAME */}
          <div>
            <label style={labelStyle}>
              <User size={12} />
              {t.addDebtForm.customerName}
            </label>
            <input
              type="text"
              placeholder={t.addDebtForm.enterCustomerName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#7c3aed66";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px #7c3aed14";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#ffffff0d";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label style={labelStyle}>
              <BadgeDollarSign size={12} />
              {t.addDebtForm.debtAmount}
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#7c3aed",
                  letterSpacing: "0.04em",
                }}
              >
                TZS
              </span>
              <input
                type="number"
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 54 }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#7c3aed66";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px #7c3aed14";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#ffffff0d";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* PREVIEW */}
          {(name || amount) && (
            <div
              style={{
                borderRadius: 18,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                padding: "20px 22px",
                color: "#fff",
                boxShadow: "0 8px 32px #7c3aed33",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t.addDebtForm.pendingDebt}
                  </p>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
                    {name || "Customer"}
                  </h3>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Wallet size={18} />
                </div>
              </div>
              <h2 style={{ fontSize: 30, fontWeight: 900, marginTop: 16, letterSpacing: "-0.03em" }}>
                TZS {amount ? Number(amount).toLocaleString() : "0"}
              </h2>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              borderRadius: 14,
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
              letterSpacing: "-0.01em",
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
            {t.addDebtForm.saveDebt}
          </button>
        </form>
      </div>
    </div>
  );
}
