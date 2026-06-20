"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard-layout";
import { useInventoryStore } from "../../store/inventory-store";
import { useSalesStore } from "../../store/sales-store";
import { useTranslation } from "../../hooks/useTranslation";
import { ShoppingCart, DollarSign, TrendingUp, Package, CalendarDays, Plus, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: 13, border: "1px solid #ffffff0d", background: "#161822",
  padding: "12px 16px", fontSize: 14, color: "#f0f0ff", outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease", boxSizing: "border-box", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7 };
const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { (e.target as HTMLElement).style.borderColor = "#7c3aed66"; (e.target as HTMLElement).style.boxShadow = "0 0 0 3px #7c3aed14"; };
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { (e.target as HTMLElement).style.borderColor = "#ffffff0d"; (e.target as HTMLElement).style.boxShadow = "none"; };

export default function SalesPage() {
  const products = useInventoryStore((state) => state.products);
  const updateStock = useInventoryStore((state) => state.updateStock);
  const fetchProducts = useInventoryStore((state) => state.fetchProducts);
  const createSale = useSalesStore((state) => state.createSale);
  const fetchSales = useSalesStore((state) => state.fetchSales);
  const sales = useSalesStore((state) => state.sales);
  const t = useTranslation();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchProducts(); fetchSales(); }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const total = selectedProduct ? selectedProduct.sellPrice * Number(quantity || 0) : 0;
  const profit = selectedProduct ? (selectedProduct.sellPrice - selectedProduct.buyPrice) * Number(quantity || 0) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;
    if (Number(quantity) > selectedProduct.stock) { toast.error("Not enough stock"); return; }
    await createSale({ id: crypto.randomUUID(), productId: selectedProduct.id, productName: selectedProduct.name, quantity: Number(quantity), total, profit, createdAt: new Date().toISOString() });
    await updateStock(selectedProduct.id, Number(quantity));
    setSelectedProductId(""); setQuantity(""); setShowForm(false);
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, background: "#0f1117", border: "1px solid #06ffa522", padding: "28px 28px", backgroundImage: "radial-gradient(ellipse at top right, #06ffa50a 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2306ffa506' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")", boxShadow: "0 0 60px #06ffa508" }}>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#06ffa510", border: "1px solid #06ffa522", color: "#06ffa5", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <Sparkles size={11} />{t.salesDashboard}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                {t.trackProductSales} {t.productSale}
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>{t.salesDescription}</p>
            </div>
            <button onClick={() => setShowForm(true)} style={{ width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg, #06ffa5, #10b981)", border: "none", color: "#07080f", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px #06ffa544", transition: "all 0.15s ease", flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {[
            { label: t.totalRevenue, value: `TZS ${totalRevenue.toLocaleString()}`, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" },
            { label: t.totalProfit, value: `TZS ${totalProfit.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514" },
            { label: t.salesCount, value: sales.length, color: "#a78bfa", bg: "#7c3aed08", border: "#7c3aed14" },
          ].map((card) => (
            <div key={card.label} style={{ background: "#0f1117", border: `1px solid ${card.border}`, borderRadius: 16, padding: "18px 20px", backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`, transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: card.color, marginTop: 8, letterSpacing: "-0.03em" }}>{card.value}</h2>
            </div>
          ))}
        </div>

        {/* SALES LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sales.map((sale) => (
            <div key={sale.id} style={{ position: "relative", overflow: "hidden", background: "#0f1117", border: "1px solid #06ffa514", borderRadius: 18, padding: "20px 22px", backgroundImage: "radial-gradient(ellipse at top right, #06ffa506 0%, transparent 55%)", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.borderColor = "#06ffa522"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "#06ffa514"; }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#06ffa510", border: "1px solid #06ffa522", color: "#06ffa5", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    <ShoppingCart size={11} />{t.productSale}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{sale.productName}</h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.revenue}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#c4b5fd", marginTop: 4, letterSpacing: "-0.02em" }}>TZS {sale.total.toLocaleString()}</h2>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: t.quantitySold, value: sale.quantity, color: "#f0f0ff", bg: "#ffffff06", border: "#ffffff0d" },
                  { label: t.profitEarned, value: `TZS ${sale.profit.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514" },
                  { label: t.saleDate, value: new Date(sale.createdAt).toLocaleDateString(), color: "#94a3b8", bg: "#ffffff04", border: "#ffffff08" },
                ].map((item) => (
                  <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: item.color, marginTop: 4 }}>{item.value}</h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECORD SALE MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", background: "#0f1117", borderRadius: 24, border: "1px solid #06ffa533", boxShadow: "0 0 80px #06ffa514", position: "relative" }}>
            <div style={{ height: 2, background: "linear-gradient(90deg, #06ffa5, #10b981, #7c3aed)" }} />
            {/* STICKY HEADER */}
            <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#0f1117ee", backdropFilter: "blur(10px)", borderBottom: "1px solid #ffffff08", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{t.recordSale}</h2>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.createAndTrackSales}</p>
              </div>
              <button onClick={() => setShowForm(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "18px 22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* PRODUCT SELECT */}
              <div>
                <label style={labelStyle}>{t.product}</label>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} onFocus={focusIn} onBlur={focusOut}>
                  <option value="" style={{ background: "#161822", color: "#6b7280" }}>{t.selectProduct}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} style={{ background: "#161822", color: "#f0f0ff" }}>{p.name} ({p.stock} left)</option>
                  ))}
                </select>
              </div>

              {/* QUANTITY */}
              <div>
                <label style={labelStyle}>{t.quantity}</label>
                <input type="number" placeholder={t.enterQuantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>

              {/* TOTALS PREVIEW */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#7c3aed0a", border: "1px solid #7c3aed1a", borderRadius: 14, padding: "16px 18px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.totalAmount}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#c4b5fd", marginTop: 8, letterSpacing: "-0.02em" }}>TZS {total.toLocaleString()}</h2>
                </div>
                <div style={{ background: "#06ffa508", border: "1px solid #06ffa514", borderRadius: 14, padding: "16px 18px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.totalProfit}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#06ffa5", marginTop: 8, letterSpacing: "-0.02em" }}>TZS {profit.toLocaleString()}</h2>
                </div>
              </div>

              {/* STOCK INDICATOR */}
              {selectedProduct && (
                <div style={{ background: "#ffffff04", border: "1px solid #ffffff08", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#7c3aed14", border: "1px solid #7c3aed22", display: "flex", alignItems: "center", justifyContent: "center", color: "#c4b5fd" }}><Package size={16} /></div>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{t.stockAvailable}</h3>
                      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{selectedProduct.stock} items remaining</p>
                    </div>
                  </div>
                  {selectedProduct.stock <= 5 && (
                    <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#f8717114", border: "1px solid #f8717122", color: "#f87171" }}>{t.lowStock}</span>
                  )}
                </div>
              )}

              <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #06ffa5, #10b981)", color: "#07080f", borderRadius: 13, padding: "13px 0", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 20px #06ffa533", transition: "all 0.15s ease", marginTop: 4 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                {t.recordSale}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
