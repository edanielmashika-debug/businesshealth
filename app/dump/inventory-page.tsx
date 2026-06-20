"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { useTranslation } from "@/hooks/useTranslation";
import { useInventoryStore } from "@/store/inventory-store";
import { Package, TrendingUp, AlertTriangle, Boxes, Trash2, Plus, X, Sparkles, DollarSign } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", borderRadius: 13, border: "1px solid #ffffff0d", background: "#161822",
  padding: "12px 16px", fontSize: 14, color: "#f0f0ff", outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease", boxSizing: "border-box", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7 };
const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#7c3aed66"; e.target.style.boxShadow = "0 0 0 3px #7c3aed14"; };
const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#ffffff0d"; e.target.style.boxShadow = "none"; };

export default function InventoryPage() {
  const t = useTranslation();
  const { products, addProduct, deleteProduct, fetchProducts } = useInventoryStore();
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !buyingPrice || !sellingPrice) return;
    await addProduct({ id: crypto.randomUUID(), name, stock: Number(stock), buyPrice: Number(buyingPrice), sellPrice: Number(sellingPrice) });
    setName(""); setStock(""); setBuyingPrice(""); setSellingPrice("");
    setShowForm(false);
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.sellPrice, 0);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 22, background: "#0f1117", border: "1px solid #7c3aed22", padding: "28px 28px", backgroundImage: "radial-gradient(ellipse at top right, #7c3aed12 0%, transparent 55%), url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed06' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")", boxShadow: "0 0 60px #7c3aed08" }}>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <Package size={11} />{t.inventoryManagement}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Smart {t.inventory}</h1>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 1.6 }}>{t.inventoryHeader}</p>
            </div>
            <button onClick={() => setShowForm(true)} style={{ width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px #7c3aed44", transition: "all 0.15s ease", flexShrink: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              <Plus size={22} />
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { label: t.product, value: totalProducts, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a", icon: <Package size={15} /> },
            { label: t.totalStock, value: totalStock, color: "#a78bfa", bg: "#7c3aed08", border: "#7c3aed14", icon: <Boxes size={15} /> },
            { label: t.lowStock, value: lowStockCount, color: "#f87171", bg: "#f8717108", border: "#f8717118", icon: <AlertTriangle size={15} /> },
            { label: t.inventoryValue, value: `TZS ${totalInventoryValue.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514", icon: <DollarSign size={15} /> },
          ].map((card) => (
            <div key={card.label} style={{ background: "#0f1117", border: `1px solid ${card.border}`, borderRadius: 16, padding: "16px 18px", backgroundImage: `radial-gradient(ellipse at top right, ${card.bg} 0%, transparent 60%)`, transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</p>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: card.color, marginTop: 8, letterSpacing: "-0.03em" }}>{card.value}</h2>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.bg, border: `1px solid ${card.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {products.map((product) => {
            const profit = product.sellPrice - product.buyPrice;
            const isLowStock = product.stock <= 5;
            return (
              <div key={product.id} style={{ position: "relative", overflow: "hidden", background: "#0f1117", border: `1px solid ${isLowStock ? "#f8717118" : "#ffffff0d"}`, borderRadius: 20, padding: "20px 22px", backgroundImage: `radial-gradient(ellipse at top right, ${isLowStock ? "#f8717106" : "#7c3aed05"} 0%, transparent 55%)`, transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {/* TOP */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#7c3aed14", border: "1px solid #7c3aed22", color: "#c4b5fd", padding: "3px 9px", borderRadius: 99, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      <Sparkles size={10} />{t.inventoryProduct}
                    </div>
                    <h2 style={{ fontSize: 19, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{product.name}</h2>
                  </div>
                  {isLowStock && <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: "#f8717114", border: "1px solid #f8717122", color: "#f87171", flexShrink: 0 }}>{t.lowStock}</span>}
                </div>

                {/* STATS GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[
                    { label: t.stockLeft, value: product.stock, color: "#f0f0ff", bg: "#ffffff06", border: "#ffffff0d" },
                    { label: t.profit, value: `TZS ${profit.toLocaleString()}`, color: "#06ffa5", bg: "#06ffa508", border: "#06ffa514" },
                    { label: t.buyingPrice, value: `TZS ${product.buyPrice.toLocaleString()}`, color: "#94a3b8", bg: "#ffffff04", border: "#ffffff08" },
                    { label: t.sellingPrice, value: `TZS ${product.sellPrice.toLocaleString()}`, color: "#c4b5fd", bg: "#7c3aed0a", border: "#7c3aed1a" },
                  ].map((item) => (
                    <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 12, padding: "10px 12px" }}>
                      <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: item.color, marginTop: 4, letterSpacing: "-0.01em" }}>{item.value}</h3>
                    </div>
                  ))}
                </div>

                {/* DELETE */}
                <button onClick={() => deleteProduct(product.id)} style={{ width: "100%", background: "#ef444408", border: "1px solid #ef444420", color: "#f87171", borderRadius: 12, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; }}>
                  <Trash2 size={14} />{t.deleteProduct}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", background: "#0f1117", borderRadius: 24, border: "1px solid #7c3aed33", boxShadow: "0 0 80px #7c3aed22", position: "relative" }}>
            <div style={{ height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)" }} />
            <button onClick={() => setShowForm(false)} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, background: "#ffffff08", border: "1px solid #ffffff0d", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={15} /></button>
            <div style={{ padding: "20px 24px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  📦 {t.addInventory}
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>{t.addProduct}</h2>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t.newProduct}</p>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label style={labelStyle}>{t.productName}</label><input type="text" placeholder={t.enterProductName} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>Stock Quantity</label><input type="number" placeholder={t.enterStockQuantity} value={stock} onChange={(e) => setStock(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={labelStyle}>{t.buyingPrice}</label><input type="number" placeholder={t.buyingPrice} value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                  <div><label style={labelStyle}>{t.sellingPrice}</label><input type="number" placeholder={t.sellingPrice} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                </div>
                <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", borderRadius: 13, padding: "13px 0", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px #7c3aed33", marginTop: 4, transition: "all 0.15s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  <Plus size={16} />{t.addProduct}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
