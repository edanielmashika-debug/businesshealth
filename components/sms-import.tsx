"use client";

import { useState } from "react";
import { useTransactionStore } from "@/store/transaction-store";
import { useTranslation } from "@/hooks/useTranslation";
import { Smartphone, Sparkles, ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 160,
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
};

export default function SmsImport() {
  const t = useTranslation();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const [sms, setSms] = useState("");

  function extractAmount(text: string) {
    const match = text.match(/(\d[\d,]*)/);
    if (!match) return 0;
    return Number(match[0].replace(/,/g, ""));
  }

  function detectProvider(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("mpesa")) return "M-Pesa";
    if (lower.includes("airtel")) return "Airtel Money";
    if (lower.includes("tigopesa")) return "Tigo Pesa";
    if (lower.includes("halopesa")) return "HaloPesa";
    return "Mobile Money";
  }

  function detectType(text: string) {
    const lower = text.toLowerCase();
    const isRevenue =
      lower.includes("received") ||
      lower.includes("umepokea") ||
      lower.includes("cash received") ||
      lower.includes("paid to you");
    return isRevenue ? "revenue" : "expense";
  }

  function handleImport() {
    if (!sms) return;
    addTransaction({
      id: crypto.randomUUID(),
      title: detectProvider(sms),
      amount: extractAmount(sms),
      category: "Mobile Money",
      type: detectType(sms),
      source: "sms" as const,
      createdAt: new Date().toISOString(),
    });
    setSms("");
  }

  const previewAmount = extractAmount(sms);
  const previewProvider = detectProvider(sms);
  const previewType = detectType(sms);
  const isRevenue = previewType === "revenue";
  const accentColor = isRevenue ? "#06ffa5" : "#f87171";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* HERO */}
      <div
        style={{
          borderRadius: 20,
          background: "#0f1117",
          border: "1px solid #7c3aed33",
          padding: "22px 24px",
          backgroundImage:
            "radial-gradient(ellipse at top right, #7c3aed18 0%, transparent 60%)",
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
          {t.smsImport.smartSmsImport}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {t.smsImport.import} {t.smsImport.mobileMoneySms}
            </h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>
              {t.smsImport.importDescription}
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
            <Smartphone size={20} />
          </div>
        </div>
      </div>

      {/* INPUT */}
      <div
        style={{
          background: "#0f1117",
          border: "1px solid #ffffff0d",
          borderRadius: 20,
          padding: "20px 22px",
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
          {t.smsImport.smsMessage}
        </h3>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, lineHeight: 1.5 }}>
          {t.smsImport.smsMessageDescription}
        </p>
        <textarea
          value={sms}
          onChange={(e) => setSms(e.target.value)}
          placeholder={`Example:\nUmepokea TZS 50,000 kutoka kwa John kupitia M-Pesa...`}
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = "#7c3aed55"; }}
          onBlur={(e) => { e.target.style.borderColor = "#ffffff0d"; }}
        />
      </div>

      {/* LIVE PREVIEW */}
      {sms && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: t.smsImport.provider, value: previewProvider, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" },
            { label: t.smsImport.amount, value: `TZS ${previewAmount.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {item.label}
              </p>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: item.color, marginTop: 6, letterSpacing: "-0.02em" }}>
                {item.value}
              </h2>
            </div>
          ))}

          {/* TYPE */}
          <div
            style={{
              background: isRevenue ? "#06ffa508" : "#f8717108",
              border: `1px solid ${isRevenue ? "#06ffa514" : "#f8717118"}`,
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {t.smsImport.transactionType}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: isRevenue ? "#06ffa514" : "#f8717114",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accentColor,
                }}
              >
                {isRevenue ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
              </div>
              <h2 style={{ fontSize: 13, fontWeight: 800, color: accentColor, textTransform: "capitalize" }}>
                {previewType}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT BUTTON */}
      <button
        onClick={handleImport}
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
        <CheckCircle2 size={16} />
        {t.smsImport.importTransaction}
      </button>
    </div>
  );
}
