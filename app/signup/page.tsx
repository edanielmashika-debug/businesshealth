"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, UserPlus } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 13,
  border: "1px solid #ffffff0d",
  background: "#161822",
  padding: "13px 16px 13px 44px",
  fontSize: 14,
  color: "#f0f0ff",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, email: data.user.email });
    }
    toast.success("Account created successfully!");
    router.push("/onboarding");
  }

  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#7c3aed66";
    e.target.style.boxShadow = "0 0 0 3px #7c3aed14";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#ffffff0d";
    e.target.style.boxShadow = "none";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07080f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundImage:
          "radial-gradient(ellipse at 30% 20%, #7c3aed0a 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #a855f706 0%, transparent 50%), url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff04' stroke-width='1'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f1117",
          borderRadius: 24,
          border: "1px solid #7c3aed22",
          overflow: "hidden",
          boxShadow: "0 0 80px #7c3aed0f",
        }}
      >
        {/* ACCENT BAR */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #7c3aed, #a855f7, #06ffa5)" }} />

        {/* HEADER */}
        <div
          style={{
            padding: "32px 32px 24px",
            borderBottom: "1px solid #ffffff08",
            backgroundImage: "radial-gradient(ellipse at top right, #7c3aed0a 0%, transparent 55%)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px #7c3aed44",
              marginBottom: 20,
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", marginBottom: 6 }}>
            Create account
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            Start managing your business smarter
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* EMAIL */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 4,
              background: loading ? "#7c3aed55" : "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              borderRadius: 13,
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: loading ? "none" : "0 4px 24px #7c3aed33",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px #7c3aed44"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px #7c3aed33"; }}
          >
            <UserPlus size={16} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 4 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#c4b5fd", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
