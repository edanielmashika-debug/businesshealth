"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { supabase } from "../lib/supabase";
import {
  Home,
  BarChart3,
  Package,
  Receipt,
  Wallet,
  Settings,
  Menu,
  X,
  BadgeDollarSignIcon,
  FileText,
  HandCoins,
  Bell,
  ChevronRight,
  Sparkles,
  LogOut,
  BrainCircuitIcon,
  UserRoundCheck,
} from "lucide-react";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const t = useTranslation();

  const links = [
    { name: t.home, href: "/", icon: Home },
    { name: t.sales, href: "/sales", icon: Receipt },
    { name: t.inventory, href: "/inventory", icon: Package },
    { name: t.transactions, href: "/transactions", icon: Wallet },
    { name: t.debts.menu, href: "/debts", icon: HandCoins },
    { name: t.customerDebtsPage.customerDebts, href: "/customer", icon: UserRoundCheck },
    { name: t.analytics, href: "/analytics", icon: BarChart3 },
    { name: t.expenses, href: "/expenses", icon: BadgeDollarSignIcon },
    { name: t.reports, href: "/reports", icon: FileText },
    { name: t.settings, href: "/settings", icon: Settings },
    { name: t.ai, href: "/ai", icon: BrainCircuitIcon },
  ];

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setLogoUrl(data.logo_url || "");
        setBusinessName(data.business_name || "");
      }
    }
    loadProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#07080f", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        />
      )}

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-5 left-5 z-50 lg:hidden flex items-center justify-center"
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff",
          boxShadow: "0 0 20px #7c3aed55",
          border: "none",
          cursor: "pointer",
        }}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: 272,
          background: "#0a0b14",
          borderRight: "1px solid #ffffff0d",
          backgroundImage:
            "radial-gradient(ellipse at 80% 0%, #7c3aed0f 0%, transparent 60%), url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff05' stroke-width='1'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        {/* BRAND */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid #ffffff08",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px #7c3aed44",
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#f0f0ff",
                  letterSpacing: "-0.02em",
                }}
              >
                Biashara Nova
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                Enterprise Platform
              </div>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  background: active
                    ? "linear-gradient(135deg, #7c3aed22, #a855f711)"
                    : "transparent",
                  border: active ? "1px solid #7c3aed33" : "1px solid transparent",
                  color: active ? "#c4b5fd" : "#6b7280",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "#ffffff06";
                    (e.currentTarget as HTMLElement).style.color = "#a0aec0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#6b7280";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active ? "#7c3aed33" : "#ffffff08",
                      color: active ? "#c4b5fd" : "inherit",
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>
                    {link.name}
                  </span>
                </div>
                {active && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* PROFILE + LOGOUT */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid #ffffff08",
          }}
        >
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background: "#ffffff06",
                border: "1px solid #ffffff08",
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                    {businessName?.charAt(0)?.toUpperCase() || "B"}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#e2e8f0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {businessName || "My Business"}
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                  {t.administrator}
                </div>
              </div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 12,
              background: "#ef444408",
              border: "1px solid #ef444420",
              color: "#f87171",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#ef444414")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#ef444408")
            }
          >
            <LogOut size={14} />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          marginLeft: 0,
          minWidth: 0,
        }}
        className="lg:ml-[272px]"
      >
        {/* HEADER */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            height: 64,
            background: "#07080fee",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid #ffffff08",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginLeft: 0 }} className="ml-12 lg:ml-0">
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#f0f0ff",
                letterSpacing: "-0.02em",
              }}
            >
              Dashboard
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
              {t.welcome}{" "}
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>Emmanuel</span> 👋
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* NOTIFICATIONS */}
            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: "#ffffff08",
                border: "1px solid #ffffff0d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                color: "#94a3b8",
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#06ffa5",
                  boxShadow: "0 0 6px #06ffa5",
                }}
              />
            </button>

            {/* PROFILE */}
            <Link href="/profile" style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px 6px 6px",
                  borderRadius: 11,
                  background: "#ffffff08",
                  border: "1px solid #ffffff0d",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>
                      {businessName?.charAt(0)?.toUpperCase() || "B"}
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                    {businessName || "My Business"}
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{t.administrator}</div>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* CONTENT */}
        <div style={{ padding: "24px 28px" }}>
          {children}
          <Toaster richColors position="top-right" closeButton duration={3000} />
        </div>
      </main>
    </div>
  );
}
