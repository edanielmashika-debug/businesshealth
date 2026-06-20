"use client";

import { useEffect } from "react";
import { useDashboardAIStore } from "@/store/dashboard-ai-store";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardCard from "@/components/dashboard-card";
import AnalyticsChart from "@/components/analytics-chart";
import CategoryChart from "@/components/category-chart";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import WeeklySummaryCard from "@/components/weekly-summary-card";
import { getTransactions } from "@/services/transaction-service";
import { useTransactionStore } from "@/store/transaction-store";
import { useInventoryStore } from "@/store/inventory-store";
import { useSalesStore } from "@/store/sales-store";
import { useExpenseStore } from "@/store/expense-store";
import { useRouter } from "next/navigation";
import { useDebtStore } from "@/store/debt-store";
import { supabase } from "@/lib/supabase";
import AiInsightsCard from "@/components/ai-insights-card";
import AiPredictionsCard from "@/components/ai-predictions-card";
import AiRecommendationsCard from "@/components/ai-recommendations-card";
import { generateRecommendations } from "@/services/ai-recommendations";
import { generatePredictions } from "@/services/ai-predictions";
import { generateInsights } from "@/services/ai-insights";
import { useTranslation } from "@/hooks/useTranslation";
import { AlertTriangle, Package } from "lucide-react";

export default function HomePage() {
  const { income, expense, profit } = useDashboardStats();
  const t = useTranslation();
  const router = useRouter();

  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const products = useInventoryStore((state) => state.products);
  const fetchProducts = useInventoryStore((state) => state.fetchProducts);
  const sales = useSalesStore((state) => state.sales);
  const fetchSales = useSalesStore((state) => state.fetchSales);
  const expenses = useExpenseStore((state) => state.expenses);
  const fetchExpenses = useExpenseStore((state) => state.fetchExpenses);
  const debts = useDebtStore((state) => state.debts);
  const { recommendation, prediction, weeklySummary, businessInsight, loading, fetchInsights } = useDashboardAIStore();

  useEffect(() => {
    fetchInsights({ sales, expenses, products, debts });
  }, []);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/signup"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile && !profile.onboarding_completed) { router.push("/onboarding"); return; }
    }
    async function loadTransactions() {
      const data = await getTransactions();
      if (!data) return;
      const formatted = data.map((transaction: any) => ({
        id: transaction.id, title: transaction.title, amount: Number(transaction.amount),
        category: transaction.category, type: transaction.type, source: transaction.source, createdAt: transaction.created_at,
      }));
      setTransactions(formatted);
    }
    checkUser();
    loadTransactions();
    fetchProducts();
    fetchSales();
    fetchExpenses();
  }, [setTransactions, router, fetchProducts, fetchSales, fetchExpenses]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalProfit - totalExpenses;
  const lowStockProducts = products.filter((product) => product.stock <= 5);
  const lowStockCount = lowStockProducts.length;
  const totalProducts = products.length;

  const bestSellerMap = sales.reduce((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);
  const bestSeller = Object.entries(bestSellerMap).sort((a, b) => b[1] - a[1])[0];

  const pendingDebts = debts.filter((debt) => debt.status === "pending");

  const predictions = generatePredictions({ totalRevenue, totalExpenses, lowStockCount, pendingDebts: pendingDebts.length });
  const recommendations = generateRecommendations({ products, debts, totalRevenue, totalExpenses });
  const insights = generateInsights({ totalRevenue, totalExpenses, lowStockCount, pendingDebts: pendingDebts.length, totalProducts });

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HEADER */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Business overview and analytics</p>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <DashboardCard title="Revenue" amount={`TZS ${totalRevenue.toLocaleString()}`} />
          <DashboardCard title="Profit" amount={`TZS ${totalProfit.toLocaleString()}`} />
          <DashboardCard title="Expenses" amount={`TZS ${totalExpenses.toLocaleString()}`} />
          <DashboardCard title="Net Profit" amount={`TZS ${netProfit.toLocaleString()}`} />
        </div>

        {/* AI INSIGHTS */}
        <AiInsightsCard insights={businessInsight ? [businessInsight] : ["Analyzing business insights..."]} />

        <WeeklySummaryCard
          revenue={totalRevenue}
          expenses={totalExpenses}
          profit={profit}
          lowStockCount={lowStockCount}
          pendingDebts={pendingDebts.length}
          aiSummary={weeklySummary}
        />

        <AiPredictionsCard predictions={prediction ? [prediction] : ["Generating prediction..."]} />
        <AiRecommendationsCard recommendations={recommendation ? [recommendation] : ["Analyzing your business..."]} />

        {/* QUICK STATS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {/* BEST SELLER */}
          <div style={{ background: "#0f1117", border: "1px solid #7c3aed22", borderRadius: 18, padding: "18px 20px", backgroundImage: "radial-gradient(ellipse at top right, #7c3aed08 0%, transparent 55%)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>Best Seller</p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", marginTop: 8, letterSpacing: "-0.02em" }}>
              {bestSeller ? bestSeller[0] : "No sales yet"}
            </h2>
            {bestSeller && <p style={{ fontSize: 12, color: "#c4b5fd", marginTop: 4 }}>{bestSeller[1]} units sold</p>}
          </div>

          {/* LOW STOCK */}
          <div style={{ background: "#0f1117", border: `1px solid ${lowStockCount > 0 ? "#f8717122" : "#ffffff0d"}`, borderRadius: 18, padding: "18px 20px", backgroundImage: `radial-gradient(ellipse at top right, ${lowStockCount > 0 ? "#f8717108" : "#ffffff04"} 0%, transparent 55%)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <AlertTriangle size={13} color={lowStockCount > 0 ? "#f87171" : "#6b7280"} />
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>Low Stock</p>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: lowStockCount > 0 ? "#f87171" : "#06ffa5", letterSpacing: "-0.03em" }}>{lowStockCount}</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Products running low</p>
          </div>

          {/* TOTAL PRODUCTS */}
          <div style={{ background: "#0f1117", border: "1px solid #06ffa514", borderRadius: 18, padding: "18px 20px", backgroundImage: "radial-gradient(ellipse at top right, #06ffa508 0%, transparent 55%)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <Package size={13} color="#06ffa5" />
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>Products</p>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#06ffa5", letterSpacing: "-0.03em" }}>{products.length}</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Inventory items</p>
          </div>
        </div>

        {/* CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 4 }}>Revenue Analytics</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Sales and revenue trends</p>
            <AnalyticsChart />
          </div>
          <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 4 }}>Category Breakdown</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Expense and income categories</p>
            <CategoryChart />
          </div>
        </div>

        {/* LOW STOCK LIST */}
        {lowStockProducts.length > 0 && (
          <div style={{ background: "#0f1117", border: "1px solid #f8717118", borderRadius: 20, padding: "20px 22px", backgroundImage: "radial-gradient(ellipse at top right, #f8717106 0%, transparent 55%)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em", marginBottom: 4 }}>Inventory Alerts</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Products that need restocking</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f8717108",
                    border: "1px solid #f8717114",
                    borderRadius: 13,
                    padding: "12px 16px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{product.name}</h3>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Low stock detected</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: "#f87171", letterSpacing: "-0.02em" }}>{product.stock}</h2>
                    <p style={{ fontSize: 10, color: "#6b7280" }}>left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
