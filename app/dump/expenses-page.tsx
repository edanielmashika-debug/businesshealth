"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import { useTranslation } from "../../hooks/useTranslation";
import { useExpenseStore } from "../../store/expense-store";
import { Plus, X, Wallet, TrendingDown, Receipt, Trash2, Sparkles } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 13,
  border: "1px solid #ffffff0d",
  background: "#161822",
  padding: "13px 16px",
  fontSize: 14,
  color: "#f0f0ff",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 8,
};

export default function ExpensesPage() {
  const t = useTranslation();
  const { expenses, addExpense, deleteExpense, fetchExpenses } = useExpenseStore();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) return;
    await addExpense({
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      category,
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setAmount("");
    setCategory("");
    setShowForm(false);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoriesCount = new Set(expenses.map((expense) => expense.category)).size;

  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#f8717166";
    e.target.style.boxShadow = "0 0 0 3px #f8717114";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#ffffff0d";
    e.target.style.boxShadow = "none";
  };

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
            border: "1px solid #f8717122",
            padding: "28px 28px",
            backgroundImage:
              "radial-gradient(ellipse at top right, #f8717112 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f8717106' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
            boxShadow: "0 0 60px #f8717108",
          }}
        >
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#f8717114",
                  border: "1px solid #f8717133",
                  color: "#fca5a5",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                <Sparkles size={11} />
                {t.expensesPage.expenseTracker}
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.expensesPage.business} {t.expensesPage.expenses}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>
                {t.expensesPage.businessExpensesDescription}
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                background: "linear-gradient(135deg, #ef4444, #f87171)",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 20px #ef444444",
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

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { label: t.expensesPage.totalExpenses, value: `TZS ${totalExpenses.toLocaleString()}`, color: "#f87171", bg: "#f8717110", border: "#f8717122", icon: <Wallet size={16} /> },
            { label: t.expensesPage.expenseRecords, value: expenses.length, color: "#facc15", bg: "#facc1510", border: "#facc1522", icon: <Receipt size={16} /> },
            { label: t.expensesPage.categories, value: categoriesCount, color: "#fca5a5", bg: "#f8717108", border: "#f8717118", icon: <TrendingDown size={16} /> },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                position: "relative",
                overflow: "hidden",
                background: "#0f1117",
                borderRadius: 18,
                border: `1px solid ${card.border}`,
                padding: "18px 20px",
                backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {card.label}
                  </p>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: card.color, marginTop: 8, letterSpacing: "-0.03em" }}>
                    {card.value}
                  </h2>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD FORM MODAL */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
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
                width: "100%",
                maxWidth: 520,
                maxHeight: "90vh",
                overflow: "hidden",
                background: "#0f1117",
                borderRadius: 24,
                border: "1px solid #f8717133",
                boxShadow: "0 0 80px #f8717114",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ACCENT BAR */}
              <div style={{ height: 2, background: "linear-gradient(90deg, #ef4444, #f87171, #facc15)", flexShrink: 0 }} />

              {/* MODAL HEADER */}
              <div
                style={{
                  padding: "18px 22px 0",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#f8717114",
                      border: "1px solid #f8717133",
                      color: "#fca5a5",
                      padding: "3px 10px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 8,
                    }}
                  >
                    <Receipt size={11} />
                    {t.expensesPage.newExpense}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
                    {t.expensesPage.addExpense}
                  </h2>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                    {t.expensesPage.addExpenseDescription}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
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
                    flexShrink: 0,
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* SCROLLABLE FORM */}
              <div style={{ overflowY: "auto", padding: "16px 22px 24px" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* TITLE */}
                  <div>
                    <label style={labelStyle}>{t.expensesPage.expenseTitle}</label>
                    <input
                      type="text"
                      placeholder={t.expensesPage.expenseTitlePlaceholder}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <label style={labelStyle}>{t.expensesPage.amount}</label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#f87171",
                          letterSpacing: "0.04em",
                          pointerEvents: "none",
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
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label style={labelStyle}>{t.expensesPage.category}</label>
                    <input
                      type="text"
                      placeholder={t.expensesPage.categoryPlaceholder}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>

                  {/* LIVE PREVIEW */}
                  {(title || amount) && (
                    <div
                      style={{
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #ef4444, #f87171)",
                        padding: "18px 20px",
                        color: "#fff",
                        boxShadow: "0 8px 28px #ef444433",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {t.expensesPage.expensePreview}
                          </p>
                          <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{title || "Expense"}</h3>
                        </div>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            background: "rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Wallet size={17} />
                        </div>
                      </div>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginTop: 14, letterSpacing: "-0.03em" }}>
                        TZS {amount ? Number(amount).toLocaleString() : "0"}
                      </h2>
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #ef4444, #f87171)",
                      color: "#fff",
                      borderRadius: 13,
                      padding: "13px 0",
                      fontWeight: 700,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 20px #ef444433",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px #ef444444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px #ef444433"; }}
                  >
                    <Plus size={16} />
                    {t.expensesPage.saveExpense}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* EXPENSE LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {expenses.length === 0 ? (
            <div
              style={{
                background: "#0f1117",
                border: "1px dashed #ffffff10",
                borderRadius: 20,
                padding: "56px 24px",
                textAlign: "center",
                backgroundImage: "radial-gradient(ellipse at center, #f8717108 0%, transparent 60%)",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 14 }}>💸</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 8 }}>
                {t.expensesPage.noExpensesYet}
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>
                {t.expensesPage.noExpensesYetDescription}
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background: "#0f1117",
                  border: "1px solid #f8717114",
                  borderRadius: 18,
                  padding: "18px 20px",
                  backgroundImage: "radial-gradient(ellipse at top right, #f8717108 0%, transparent 55%)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#f8717122";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#f8717114";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  {/* LEFT */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.01em" }}>
                        {expense.title}
                      </h2>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#f8717114",
                          border: "1px solid #f8717122",
                          color: "#fca5a5",
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#4b5563", marginTop: 8 }}>
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: "#f87171", letterSpacing: "-0.02em" }}>
                      TZS {expense.amount.toLocaleString()}
                    </h2>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#ef444408",
                        border: "1px solid #ef444422",
                        color: "#f87171",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
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
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
