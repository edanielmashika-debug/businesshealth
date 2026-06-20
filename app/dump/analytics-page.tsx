"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import DashboardLayout from "../../components/dashboard-layout";
import AnalyticsChart from "../../components/analytics-chart";
import CategoryChart from "../../components/category-chart";
import { useInventoryStore } from "../../store/inventory-store";
import { useExpenseStore } from "../../store/expense-store";
import { useTransactionStore } from "../../store/transaction-store";
import { DollarSign, TrendingUp, ShoppingCart, Wallet } from "lucide-react";
import { getSales } from "../../lib/sales";

export default function AnalyticsPage() {
  const t = useTranslation();
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    async function loadSales() {
      const data = await getSales();
      if (!data) return;
      setSales(data.map((sale: any) => ({
        id: sale.id, productId: sale.product_id, productName: sale.product_name,
        quantity: sale.quantity, total: Number(sale.total), profit: Number(sale.profit), createdAt: sale.created_at,
      })));
    }
    loadSales();
  }, []);

  const { products } = useInventoryStore();
  const { expenses } = useExpenseStore();
  const transactions = useTransactionStore((state) => state.transactions);

  const salesRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const salesProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const revenueTransactions = transactions.filter((t) => t.type === "revenue");
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const transactionRevenue = revenueTransactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const manualExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = salesRevenue + transactionRevenue;
  const totalExpenses = manualExpenses + transactionExpenses;
  const netProfit = totalRevenue - totalExpenses;

  const today = new Date().toISOString().split("T")[0];
  const todaySales = sales.filter((s) => s.createdAt.startsWith(today));
  const todayTransactions = transactions.filter((t) => t.createdAt.startsWith(today));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0) + todayTransactions.filter((t) => t.type === "revenue").reduce((sum, t) => sum + t.amount, 0);
  const todayExpenses = expenses.filter((e) => e.createdAt.startsWith(today)).reduce((sum, e) => sum + e.amount, 0) + todayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const todayProfit = todayRevenue - todayExpenses;

  const monthlyGrowth = useMemo(() => {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const lm = cm === 0 ? 11 : cm - 1, ly = cm === 0 ? cy - 1 : cy;
    const calcRev = (month: number, year: number) =>
      transactions.filter((t) => { const d = new Date(t.createdAt); return t.type === "revenue" && d.getMonth() === month && d.getFullYear() === year; }).reduce((s, t) => s + t.amount, 0) +
      sales.filter((s) => { const d = new Date(s.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).reduce((s, sale) => s + sale.total, 0);
    const cur = calcRev(cm, cy), prev = calcRev(lm, ly);
    return prev === 0 ? 100 : ((cur - prev) / prev) * 100;
  }, [transactions, sales]);

  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const productCount: Record<string, number> = {};
  sales.forEach((s) => { productCount[s.productName] = (productCount[s.productName] || 0) + s.quantity; });
  const bestSeller = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];

  const statCards = [
    { label: t.analyticsPage.totalRevenue, value: `TZS ${totalRevenue.toLocaleString()}`, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a", icon: <DollarSign size={16} /> },
    { label: t.analyticsPage.totalExpenses, value: `TZS ${totalExpenses.toLocaleString()}`, color: "#f87171", bg: "#f8717108", border: "#f8717118", icon: <span style={{ fontSize: 16 }}>💸</span> },
    { label: t.analyticsPage.netProfit, value: `TZS ${netProfit.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514", icon: <TrendingUp size={16} /> },
    { label: t.analyticsPage.totalSales, value: sales.length, color: "#a78bfa", bg: "#7c3aed08", border: "#7c3aed14", icon: <ShoppingCart size={16} /> },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO */}
        <div
          style={{
            position: "relative", overflow: "hidden", borderRadius: 22,
            background: "#0f1117", border: "1px solid #7c3aed22", padding: "28px 28px",
            backgroundImage: "radial-gradient(ellipse at top right, #7c3aed12 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
            boxShadow: "0 0 60px #7c3aed08",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 20, position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <TrendingUp size={11} />{t.analyticsPage.businessAnalytics}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.analyticsPage.financial} {t.analyticsPage.overview}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>{t.analyticsPage.financialOverviewDescription}</p>
            </div>
            {/* Mini stat panels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 240 }}>
              {[
                { label: t.analyticsPage.revenue, value: `TZS ${totalRevenue.toLocaleString()}`, color: "#c4b5fd" },
                { label: t.analyticsPage.profit, value: `TZS ${netProfit.toLocaleString()}`, color: "#06ffa5" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#ffffff06", border: "1px solid #ffffff0d", borderRadius: 14, padding: "14px 16px" }}>
                  <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                  <h2 style={{ fontSize: 14, fontWeight: 800, color: item.color, marginTop: 6, letterSpacing: "-0.01em" }}>{item.value}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: "#0f1117", border: `1px solid ${card.border}`, borderRadius: 18, padding: "18px 20px", backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`, transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
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

        {/* TODAY STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { label: t.analyticsPage.todaysRevenue, value: `TZS ${todayRevenue.toLocaleString()}`, color: "#c4b5fd", border: "#7c3aed1a" },
            { label: t.analyticsPage.totalExpenses, value: `TZS ${todayExpenses.toLocaleString()}`, color: "#f87171", border: "#f8717118" },
            { label: t.analyticsPage.todaysProfit, value: `TZS ${todayProfit.toLocaleString()}`, color: "#06ffa5", border: "#06ffa514" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#0f1117", border: `1px solid ${item.border}`, borderRadius: 16, padding: "16px 18px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{item.label}</p>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: item.color, marginTop: 8, letterSpacing: "-0.02em" }}>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* MONTHLY GROWTH BANNER */}
        <div
          style={{
            position: "relative", overflow: "hidden", borderRadius: 20,
            background: "#0f1117", border: "1px solid #7c3aed33",
            padding: "22px 26px",
            backgroundImage: "radial-gradient(ellipse at top right, #7c3aed18 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
            boxShadow: "0 0 40px #7c3aed0a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.analyticsPage.monthlyGrowth}</p>
              <h2 style={{ fontSize: 48, fontWeight: 900, color: monthlyGrowth >= 0 ? "#06ffa5" : "#f87171", letterSpacing: "-0.04em", marginTop: 6 }}>
                {monthlyGrowth.toFixed(1)}%
              </h2>
            </div>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#7c3aed18", border: "1px solid #7c3aed33", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4b5fd" }}>
              <Wallet size={28} />
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 4 }}>{t.analyticsPage.revenueOverview}</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{t.analyticsPage.revenueOverviewDescription}</p>
            <AnalyticsChart />
          </div>
          <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 4 }}>{t.analyticsPage.expenseCategories}</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{t.analyticsPage.expenseCategoriesDescription}</p>
            <CategoryChart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
