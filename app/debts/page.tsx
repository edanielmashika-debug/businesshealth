"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import DashboardLayout from "@/components/dashboard-layout";
import AddDebtForm from "@/components/add-debt-form";
import { useDebtStore } from "@/store/debt-store";
import { getDebts, updateDebtStatus, deleteDebtFromDB } from "@/lib/debts";
import { Wallet, CheckCircle2, Clock3, Trash2, Plus, X, BadgeDollarSign, Sparkles } from "lucide-react";

const statCard = (
  label: string,
  value: string | number,
  color: string,
  bg: string,
  border: string,
  icon: React.ReactNode
) => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      background: "#0f1117",
      borderRadius: 18,
      border: `1px solid ${border}`,
      padding: "18px 20px",
      backgroundImage: `radial-gradient(ellipse at top right, ${bg} 0%, transparent 60%)`,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {label}
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 900, color, marginTop: 8, letterSpacing: "-0.03em" }}>
          {value}
        </h2>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
    </div>
  </div>
);

export default function DebtsPage() {
  const t = useTranslation();
  const debts = useDebtStore((state) => state.debts);
  const setDebts = useDebtStore((state) => state.setDebts);
  const markPaid = useDebtStore((state) => state.markPaid);
  const deleteDebt = useDebtStore((state) => state.deleteDebt);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadDebts() {
      const data = await getDebts();
      if (!data) return;
      const formatted = data.map((debt) => ({
        id: debt.id,
        name: debt.name,
        amount: Number(debt.amount),
        status: debt.status as "pending" | "paid",
        createdAt: debt.created_at,
      }));
      setDebts(formatted);
    }
    loadDebts();
  }, [setDebts]);

  async function handleMarkPaid(id: string) {
    markPaid(id);
    await updateDebtStatus(id, "paid");
  }

  async function handleDelete(id: string) {
    deleteDebt(id);
    await deleteDebtFromDB(id);
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const paidDebts = debts.filter((debt) => debt.status === "paid");
  const pendingDebts = debts.filter((debt) => debt.status === "pending");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>

        {/* HERO */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            background: "#0f1117",
            border: "1px solid #7c3aed22",
            padding: "28px 28px",
            backgroundImage:
              "radial-gradient(ellipse at top right, #7c3aed14 0%, transparent 55%), radial-gradient(ellipse at bottom left, #a855f706 0%, transparent 50%)",
            boxShadow: "0 0 60px #7c3aed08",
          }}
        >
          {/* grid texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <Sparkles size={11} />
                {t.debts.debtTracking}
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.debts.customer} {t.debts.Debts}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>
                {t.debts.customerDebtsDescription}
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
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

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {statCard(t.debts.totalDebt, `TZS ${totalDebt.toLocaleString()}`, "#f87171", "#f8717110", "#f8717122", <Wallet size={16} />)}
          {statCard(t.debts.paidDebts, paidDebts.length, "#06ffa5", "#06ffa510", "#06ffa522", <CheckCircle2 size={16} />)}
          {statCard(t.debts.pendingDebts, pendingDebts.length, "#facc15", "#facc1510", "#facc1522", <Clock3 size={16} />)}
        </div>

        {/* POPUP MODAL */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "hidden", background: "#0f1117", borderRadius: 24, border: "1px solid #7c3aed33", boxShadow: "0 0 80px #7c3aed22", display: "flex", flexDirection: "column" }}>
              {/* accent bar */}
              <div style={{ height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)", flexShrink: 0 }} />

              {/* header */}
              <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    <BadgeDollarSign size={11} />
                    {t.debts.addNewDebt}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
                    {t.debts.recordCustomerDebt}
                  </h2>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t.debts.recordCustomerDebtDescription}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "16px 20px 24px" }}>
                <AddDebtForm />
              </div>
            </div>
          </div>
        )}

        {/* DEBT LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {debts.length === 0 ? (
            <div style={{ background: "#0f1117", border: "1px dashed #ffffff14", borderRadius: 20, padding: "56px 24px", textAlign: "center", backgroundImage: "radial-gradient(ellipse at center, #7c3aed08 0%, transparent 60%)" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>💰</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 8 }}>{t.debts.noDebtsRecorded}</h2>
              <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>{t.debts.noDebtsRecordedDescription}</p>
            </div>
          ) : (
            debts.map((debt) => {
              const isPaid = debt.status === "paid";
              return (
                <div
                  key={debt.id}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "#0f1117",
                    border: `1px solid ${isPaid ? "#06ffa514" : "#facc1514"}`,
                    borderRadius: 18,
                    padding: "20px 22px",
                    backgroundImage: `radial-gradient(ellipse at top right, ${isPaid ? "#06ffa508" : "#facc1508"} 0%, transparent 55%)`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    {/* LEFT */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{debt.name}</h2>
                        <span style={{
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: isPaid ? "#06ffa514" : "#facc1514",
                          border: `1px solid ${isPaid ? "#06ffa522" : "#facc1522"}`,
                          color: isPaid ? "#06ffa5" : "#facc15",
                        }}>
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{t.debts.customerDebtRecord}</p>
                      <h3 style={{ fontSize: 26, fontWeight: 900, color: isPaid ? "#06ffa5" : "#f87171", marginTop: 10, letterSpacing: "-0.03em" }}>
                        TZS {debt.amount.toLocaleString()}
                      </h3>
                      <p style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
                        Added on {new Date(debt.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
                      {debt.status === "pending" && (
                        <button
                          onClick={() => handleMarkPaid(debt.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 7,
                            background: "#06ffa514",
                            border: "1px solid #06ffa533",
                            color: "#06ffa5",
                            padding: "10px 16px",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#06ffa522"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#06ffa514"; }}
                        >
                          <CheckCircle2 size={14} />
                          {t.debts.markAsPaid}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(debt.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          background: "#ef444408",
                          border: "1px solid #ef444422",
                          color: "#f87171",
                          padding: "10px 16px",
                          borderRadius: 12,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; }}
                      >
                        <Trash2 size={14} />
                        {t.debts.deleteDebt}
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
