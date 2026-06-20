"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/lib/delete-account";
import { useTheme } from "next-themes";
import { exportTransactions } from "@/lib/export-transactions";
import { useTransactionStore } from "@/store/transaction-store";
import { useLanguageStore } from "@/store/language-store";
import { DollarSign, Download, LogOut, Trash2, ShieldCheck, Cloud, Smartphone, Sun, Moon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const t = useTranslation();
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { theme, setTheme } = useTheme();
  const transactions = useTransactionStore((state) => state.transactions);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmed = confirm("Delete your account permanently?");
    if (!confirmed) return;
    await deleteAccount();
    router.push("/login");
  }

  const settingRow = (
    icon: React.ReactNode,
    iconBg: string,
    iconColor: string,
    title: string,
    description: string,
    rightContent: React.ReactNode,
    onClick?: () => void
  ) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        background: "#161822",
        border: "1px solid #ffffff0d",
        borderRadius: 14,
        padding: "14px 16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed33"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: iconBg, border: `1px solid ${iconColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: iconColor.replace("33", "").replace("22", "") }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{title}</h3>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{description}</p>
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{rightContent}</div>
    </button>
  );

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HEADER */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            {t.settingsPage.settings}
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{t.settingsPage.settingsDescription}</p>
        </div>

        {/* APP SETTINGS CARD */}
        <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 22, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #ffffff08", backgroundImage: "radial-gradient(ellipse at top right, #7c3aed08 0%, transparent 55%)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0" }}>{t.settingsPage.appSettings}</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{t.settingsPage.appSettingsDescription}</p>
          </div>

          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* CURRENCY */}
            {settingRow(
              <DollarSign size={16} />,
              "#7c3aed18", "#7c3aed44",
              t.settingsPage.changeCurrency,
              t.settingsPage.changeCurrencyDescription,
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c4b5fd", background: "#7c3aed18", border: "1px solid #7c3aed33", padding: "3px 10px", borderRadius: 99 }}>TZS</span>
            )}

            {/* EXPORT */}
            {settingRow(
              <Download size={16} />,
              "#06ffa510", "#06ffa522",
              t.settingsPage.exportReports,
              t.settingsPage.exportReportsDescription,
              <span style={{ fontSize: 12, fontWeight: 700, color: "#06ffa5" }}>{t.settingsPage.export}</span>,
              () => exportTransactions(transactions)
            )}

            {/* DARK MODE */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "#161822",
                border: "1px solid #ffffff0d",
                borderRadius: 14,
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed33"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#ffffff0d"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "#facc1514", border: "1px solid #facc1533", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {theme === "dark" ? <Sun size={16} color="#facc15" /> : <Moon size={16} color="#facc15" />}
                </div>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", textAlign: "left" }}>
                    {theme === "dark" ? t.settingsPage.lightMode : t.settingsPage.darkMode}
                  </h3>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2, textAlign: "left" }}>Switch interface theme</p>
                </div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 99,
                  background: theme === "dark" ? "#7c3aed" : "#374151",
                  position: "relative",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: theme === "dark" ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </button>

            {/* LANGUAGE */}
            <div style={{ display: "flex", gap: 8 }}>
              {(["en", "sw"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    background: language === lang ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#161822",
                    border: language === lang ? "none" : "1px solid #ffffff0d",
                    color: language === lang ? "#fff" : "#6b7280",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: language === lang ? "0 4px 16px #7c3aed33" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {lang === "en" ? "English" : "Kiswahili"}
                </button>
              ))}
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#ef444408",
                border: "1px solid #ef444422",
                color: "#f87171",
                borderRadius: 13,
                padding: "13px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; }}
            >
              <LogOut size={15} />
              {t.settingsPage.logout}
            </button>

            {/* DELETE ACCOUNT */}
            <button
              onClick={handleDeleteAccount}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#ef444408",
                border: "1px solid #ef444420",
                color: "#f87171",
                borderRadius: 13,
                padding: "13px 0",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                opacity: 0.7,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
            >
              <Trash2 size={15} />
              {t.settingsPage.deleteAccount}
            </button>
          </div>
        </div>

        {/* SYSTEM INFO */}
        <div style={{ background: "#0f1117", border: "1px solid #ffffff0d", borderRadius: 22, padding: "20px 22px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>{t.settingsPage.businessSystem}</h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>{t.settingsPage.businessSystemDescription}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {[
              { icon: <Cloud size={15} />, label: t.settingsPage.cloudSync, value: t.settingsPage.active, color: "#c4b5fd", bg: "#7c3aed14", border: "#7c3aed22" },
              { icon: <ShieldCheck size={15} />, label: t.settingsPage.security, value: t.settingsPage.protected, color: "#06ffa5", bg: "#06ffa510", border: "#06ffa522" },
              { icon: <Smartphone size={15} />, label: t.settingsPage.multiDevice, value: t.settingsPage.enabled, color: "#94a3b8", bg: "#ffffff08", border: "#ffffff0d" },
            ].map((item) => (
              <div key={item.label} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8, color: item.color }}>
                  {item.icon}
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
