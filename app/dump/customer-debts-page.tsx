"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import { useTranslation } from "../../hooks/useTranslation";
import { Plus, X, Trash2, Wallet, Users, AlertTriangle, CreditCard, Sparkles } from "lucide-react";
import { useCustomerDebtStore } from "../../store/customer-debt-store";

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: 13, border: "1px solid #ffffff0d", background: "#161822",
  padding: "12px 16px", fontSize: 14, color: "#f0f0ff", outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease", boxSizing: "border-box", fontFamily: "inherit",
};
const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { (e.target as HTMLElement).style.borderColor = "#7c3aed66"; (e.target as HTMLElement).style.boxShadow = "0 0 0 3px #7c3aed14"; };
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { (e.target as HTMLElement).style.borderColor = "#ffffff0d"; (e.target as HTMLElement).style.boxShadow = "none"; };

export default function CustomerDebtsPage() {
  const t = useTranslation();
  const { debts, fetchDebts, addDebt, deleteDebt, recordPayment } = useCustomerDebtStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchDebts(); }, []);

  const outstandingDebt = useMemo(() => debts.reduce((sum, d) => sum + (d.amount - d.paid_amount), 0), [debts]);
  const unpaidCustomers = debts.filter((d) => d.status !== "paid").length;
  const collectedThisMonth = useMemo(() => {
    const now = new Date();
    return debts.filter((d) => { const c = new Date(d.created_at); return c.getMonth() === now.getMonth() && c.getFullYear() === now.getFullYear(); }).reduce((sum, d) => sum + d.paid_amount, 0);
  }, [debts]);

  async function handleAddDebt(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName || !amount) return;
    await addDebt({ id: crypto.randomUUID(), customer_name: customerName, phone, amount: Number(amount), paid_amount: 0, status: "unpaid", due_date: dueDate, notes, created_at: new Date().toISOString() });
    setCustomerName(""); setPhone(""); setAmount(""); setDueDate(""); setNotes("");
    setShowAddModal(false);
  }

  async function handlePayment() {
    if (!selectedDebtId || !paymentAmount) return;
    await recordPayment(selectedDebtId, Number(paymentAmount));
    setPaymentAmount(""); setSelectedDebtId(""); setShowPaymentModal(false);
  }

  const selectedDebt = debts.find((d) => d.id === selectedDebtId);

  const modalBox: React.CSSProperties = {
    width: "100%", background: "#0f1117", borderRadius: 24, border: "1px solid #7c3aed33",
    boxShadow: "0 0 80px #7c3aed22", overflow: "hidden",
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, background: "#0f1117", border: "1px solid #7c3aed22", padding: "28px 28px", backgroundImage: "radial-gradient(ellipse at top right, #7c3aed12 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")", boxShadow: "0 0 60px #7c3aed08" }}>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <Wallet size={11} />{t.customerDebtsPage.customerDebtTracker}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.customerDebtsPage.customer} {t.customerDebtsPage.debts}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>{t.customerDebtsPage.trackCustomerDebts}</p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{ width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px #7c3aed44", transition: "all 0.15s ease", flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { label: t.customerDebtsPage.outstandingDebt, value: `TZS ${outstandingDebt.toLocaleString()}`, color: "#f87171", bg: "#f8717108", border: "#f8717118", icon: <Wallet size={16} /> },
            { label: t.customerDebtsPage.unpaidCustomers, value: unpaidCustomers, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a", icon: <Users size={16} /> },
            { label: t.customerDebtsPage.collectedThisMonth, value: `TZS ${collectedThisMonth.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514", icon: <CreditCard size={16} /> },
          ].map((card) => (
            <div key={card.label} style={{ background: "#0f1117", border: `1px solid ${card.border}`, borderRadius: 18, padding: "18px 20px", backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`, transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: card.color, marginTop: 8, letterSpacing: "-0.03em" }}>{card.value}</h2>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: card.bg, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD DEBT MODAL */}
        {showAddModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ ...modalBox, maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)" }} />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{t.customerDebtsPage.addCustomerDebt}</h2>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t.customerDebtsPage.recordMoneyOwed}</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
                </div>
                <form onSubmit={handleAddDebt} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { placeholder: t.customerDebtsPage.customerName, value: customerName, onChange: setCustomerName, type: "text" },
                    { placeholder: t.customerDebtsPage.phoneNumber, value: phone, onChange: setPhone, type: "text" },
                    { placeholder: t.customerDebtsPage.amountOwed, value: amount, onChange: setAmount, type: "number" },
                    { placeholder: "", value: dueDate, onChange: setDueDate, type: "date" },
                  ].map((field, i) => (
                    <input key={i} type={field.type} value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  ))}
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.customerDebtsPage.notes} rows={3}
                    style={{ ...inputStyle, resize: "none" }} onFocus={focusIn} onBlur={focusOut} />
                  <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", borderRadius: 13, padding: "13px 0", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 20px #7c3aed33", marginTop: 4 }}>
                    {t.customerDebtsPage.saveDebt}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT MODAL */}
        {showPaymentModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ ...modalBox, maxWidth: 420, border: "1px solid #06ffa522" }}>
              <div style={{ height: 2, background: "linear-gradient(90deg, #06ffa5, #10b981)" }} />
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{t.customerDebtsPage.recordPayment}</h2>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t.customerDebtsPage.enteramount}</p>
                  </div>
                  <button onClick={() => { setShowPaymentModal(false); setPaymentAmount(""); }} style={{ width: 34, height: 34, borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder={t.customerDebtsPage.amountReceived} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                  <button onClick={handlePayment} style={{ width: "100%", background: "linear-gradient(135deg, #06ffa5, #10b981)", color: "#07080f", borderRadius: 13, padding: "13px 0", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 20px #06ffa533" }}>
                    {t.customerDebtsPage.savePayment}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEBTS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {debts.length === 0 ? (
            <div style={{ background: "#0f1117", border: "1px dashed #ffffff10", borderRadius: 20, padding: "56px 24px", textAlign: "center", backgroundImage: "radial-gradient(ellipse at center, #7c3aed08 0%, transparent 60%)" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>💳</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 8 }}>{t.customerDebtsPage.noCustomerDebts}</h2>
              <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>{t.customerDebtsPage.startTrackingDebts}</p>
            </div>
          ) : (
            debts.map((debt) => {
              const remaining = debt.amount - debt.paid_amount;
              const overdue = debt.status !== "paid" && debt.due_date && new Date(debt.due_date) < new Date();
              const isPaid = debt.status === "paid";
              return (
                <div key={debt.id} style={{ background: "#0f1117", border: `1px solid ${isPaid ? "#06ffa514" : overdue ? "#f8717118" : "#ffffff0d"}`, borderRadius: 18, padding: "20px 22px", backgroundImage: `radial-gradient(ellipse at top right, ${isPaid ? "#06ffa506" : overdue ? "#f8717106" : "#7c3aed05"} 0%, transparent 55%)`, transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.01em" }}>{debt.customer_name}</h2>
                        {overdue && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#f8717114", border: "1px solid #f8717122", color: "#f87171" }}><AlertTriangle size={11} />{t.customerDebtsPage.overdue}</span>}
                        {isPaid && <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#06ffa514", border: "1px solid #06ffa522", color: "#06ffa5" }}>{t.customerDebtsPage.paid}</span>}
                      </div>
                      {debt.phone && <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>{debt.phone}</p>}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {[
                          { label: t.customerDebtsPage.debt, value: `TZS ${debt.amount.toLocaleString()}`, color: "#f87171" },
                          { label: t.customerDebtsPage.paid, value: `TZS ${debt.paid_amount.toLocaleString()}`, color: "#06ffa5" },
                          { label: t.customerDebtsPage.remaining, value: `TZS ${remaining.toLocaleString()}`, color: "#c4b5fd" },
                        ].map((item) => (
                          <div key={item.label} style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 11, padding: "10px 12px" }}>
                            <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                            <h3 style={{ fontSize: 13, fontWeight: 800, color: item.color, marginTop: 4 }}>{item.value}</h3>
                          </div>
                        ))}
                      </div>
                      {debt.due_date && <p style={{ fontSize: 11, color: "#4b5563", marginTop: 10 }}>Due: {new Date(debt.due_date).toLocaleDateString()}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      {!isPaid && (
                        <button onClick={() => { setSelectedDebtId(debt.id); setShowPaymentModal(true); }} style={{ display: "flex", alignItems: "center", gap: 7, background: "#06ffa514", border: "1px solid #06ffa533", color: "#06ffa5", padding: "9px 16px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s ease" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#06ffa522"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#06ffa514"; }}>
                          <CreditCard size={14} />{t.customerDebtsPage.recordPayment}
                        </button>
                      )}
                      <button onClick={() => deleteDebt(debt.id)} style={{ display: "flex", alignItems: "center", gap: 7, background: "#ef444408", border: "1px solid #ef444422", color: "#f87171", padding: "9px 16px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; }}>
                        <Trash2 size={14} />{t.customerDebtsPage.deleteDebt}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
