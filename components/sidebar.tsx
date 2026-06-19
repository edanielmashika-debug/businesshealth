"use client";
import { LayoutDashboard, Receipt, Wallet, Package, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Transactions", href: "/transactions" },
  { name: "Debts", href: "/debts" },
  { name: "Inventory", href: "/inventory" },
  { name: "Settings", href: "/settings" },
  { name: "Analytics", href: "/analytics" },
  { name: "Sales", href: "/sales" },
  { name: "Expenses", href: "/expenses" },
  { name: "Reports", href: "/reports" },
  { name: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const navStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
    padding: "16px 12px",
  };

  const linkStyle = {
    display: "block",
    padding: "9px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    color: "#6b7280",
    textDecoration: "none",
    transition: "all 0.15s ease",
    border: "1px solid transparent",
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          borderBottom: "1px solid #ffffff08",
          background: "#0a0b14",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#c4b5fd",
            letterSpacing: "-0.02em",
          }}
        >
          Biashara
        </span>
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#7c3aed22",
            border: "1px solid #7c3aed44",
            color: "#c4b5fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <aside
            style={{
              width: 260,
              height: "100%",
              background: "#0a0b14",
              padding: "20px 0",
              display: "flex",
              flexDirection: "column",
              backgroundImage:
                "radial-gradient(ellipse at 80% 0%, #7c3aed0f 0%, transparent 60%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px 20px",
                borderBottom: "1px solid #ffffff08",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#c4b5fd",
                  letterSpacing: "-0.02em",
                }}
              >
                Biashara
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "#ffffff08",
                  border: "none",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={15} />
              </button>
            </div>

            <nav style={navStyle}>
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={linkStyle}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#7c3aed14";
                    (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                    (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed22";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#6b7280";
                    (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: 240,
          minHeight: "100vh",
          background: "#0a0b14",
          borderRight: "1px solid #ffffff08",
          backgroundImage:
            "radial-gradient(ellipse at 80% 0%, #7c3aed0f 0%, transparent 60%), url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff04' stroke-width='1'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid #ffffff08",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#c4b5fd",
              letterSpacing: "-0.02em",
            }}
          >
            Biashara
          </span>
        </div>

        <nav style={navStyle}>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              style={linkStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#7c3aed14";
                (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed22";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#6b7280";
                (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
