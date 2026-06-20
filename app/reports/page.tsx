"use client";

import { useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import { useTranslation } from "../../hooks/useTranslation";
import { generateSalesPDF } from "../../lib/pdf-report";
import { useSalesStore } from "../../store/sales-store";
import ReportChart from "../../components/report-chart";
import { FileText, Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const statCard = (label: string, value: string | number, color: string, accent: string) => (
  <div
    style={{
      background: "#0f1117",
      border: `1px solid ${accent}`,
      borderRadius: 16,
      padding: "18px 20px",
      backgroundImage: `radial-gradient(ellipse at top right, ${accent.replace("22", "0a")} 0%, transparent 60%)`,
    }}
  >
    <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>
      {label}
    </p>
    <h2 style={{ fontSize: 24, fontWeight: 900, color, marginTop: 8, letterSpacing: "-0.03em" }}>
      {value}
    </h2>
  </div>
);

export default function ReportsPage() {
  const t = useTranslation();
  const sales = useSalesStore((state) => state.sales);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredSales = sales.filter((sale) => {
    if (!startDate || !endDate) return true;
    const saleDate = new Date(sale.createdAt);
    return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalSales = filteredSales.length;
  const chartData = filteredSales.map((sale) => ({ date: new Date(sale.createdAt).toLocaleDateString(), revenue: sale.total, profit: sale.profit }));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthSales = filteredSales.filter((sale) => { const d = new Date(sale.createdAt); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; });
  const lastMonthSales = filteredSales.filter((sale) => { const d = new Date(sale.createdAt); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; });

  const currentRevenue = currentMonthSales.reduce((sum, sale) => sum + sale.total, 0);
  const lastRevenue = lastMonthSales.reduce((sum, sale) => sum + sale.total, 0);
  const revenueGrowth = lastRevenue === 0 ? 100 : ((currentRevenue - lastRevenue) / lastRevenue) * 100;

  const currentProfit = currentMonthSales.reduce((sum, sale) => sum + sale.profit, 0);
  const lastProfit = lastMonthSales.reduce((sum, sale) => sum + sale.profit, 0);
  const profitGrowth = lastProfit === 0 ? 100 : ((currentProfit - lastProfit) / lastProfit) * 100;

  const dateInputStyle: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid #ffffff0d",
    background: "#161822",
    padding: "11px 14px",
    color: "#f0f0ff",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s ease",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HEADER */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            {t.reportsPage.reports}
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{t.reportsPage.reportsDescription}</p>
        </div>

        {/* DATE FILTER */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #ffffff0d",
            borderRadius: 20,
            padding: "20px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Calendar size={16} color="#c4b5fd" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{t.reportsPage.filterReportsByDate}</h2>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>{t.reportsPage.selectReportPeriod}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                {t.reportsPage.startDate}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={dateInputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#7c3aed55"; }}
                onBlur={(e) => { e.target.style.borderColor = "#ffffff0d"; }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                {t.reportsPage.endDate}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={dateInputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#7c3aed55"; }}
                onBlur={(e) => { e.target.style.borderColor = "#ffffff0d"; }}
              />
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {statCard(t.reportsPage.revenue, `TZS ${totalRevenue.toLocaleString()}`, "#c4b5fd", "#7c3aed22")}
          {statCard(t.reportsPage.profit, `TZS ${totalProfit.toLocaleString()}`, "#06ffa5", "#06ffa522")}
          {statCard(t.reportsPage.salesCount, totalSales, "#94a3b8", "#ffffff0d")}
        </div>

        {/* CHART */}
        <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 20, padding: "20px 22px" }}>
          <ReportChart data={chartData} />
        </div>

        {/* GROWTH CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: t.reportsPage.monthlyRevenueGrowth, growth: revenueGrowth, current: currentRevenue, last: lastRevenue, color: "#c4b5fd", accent: "#7c3aed22" },
            { label: t.reportsPage.monthlyProfitGrowth, growth: profitGrowth, current: currentProfit, last: lastProfit, color: "#06ffa5", accent: "#06ffa522" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#0f1117", border: `1px solid ${item.accent}`, borderRadius: 16, padding: "18px 20px", backgroundImage: `radial-gradient(ellipse at top right, ${item.accent.replace("22", "08")} 0%, transparent 60%)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                {item.growth >= 0
                  ? <TrendingUp size={14} color={item.color} />
                  : <TrendingDown size={14} color="#f87171" />
                }
                <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: item.growth >= 0 ? item.color : "#f87171", letterSpacing: "-0.03em" }}>
                {item.growth.toFixed(1)}%
              </h2>
              <p style={{ fontSize: 11, color: "#4b5563", marginTop: 6 }}>
                TZS {item.current.toLocaleString()} vs TZS {item.last.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* DOWNLOAD */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #ffffff0d",
            borderRadius: 20,
            padding: "18px 22px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#7c3aed18", border: "1px solid #7c3aed33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} color="#c4b5fd" />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{t.reportsPage.salesReport}</h2>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.reportsPage.salesReportDescription}</p>
            </div>
          </div>
          <button
            onClick={() => generateSalesPDF(filteredSales)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              borderRadius: 12,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px #7c3aed33",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <Download size={14} />
            {t.reportsPage.downloadPdf}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
