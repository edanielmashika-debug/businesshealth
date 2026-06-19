"use client";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { deleteAccountData } from "../services/account-service";

export default function Navbar() {
  const router = useRouter();

  async function handleLogOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    const confirmed = confirm("Are you sure you want to delete your account data?");
    if (!confirmed) return;
    await deleteAccountData();
    router.push("/login");
  }

  return (
    <header
      style={{
        borderBottom: "1px solid #ffffff08",
        background: "#0a0b14",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(20px)",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#e2e8f0",
            letterSpacing: "-0.01em",
          }}
        >
          Welcome Back 👋
        </h2>
      </div>

      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 13,
          boxShadow: "0 0 16px #7c3aed44",
        }}
      >
        A
      </div>

      <button
        onClick={handleDeleteAccount}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 9,
          background: "#ef444408",
          border: "1px solid #ef444420",
          color: "#f87171",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "#ef444416")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "#ef444408")
        }
      >
        <Trash2 size={13} />
      </button>
    </header>
  );
}
