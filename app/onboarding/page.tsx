"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { Sparkles, Building2, Phone, MapPin, ChevronRight } from "lucide-react";

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  paddingLeft: 16,
  appearance: "none",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  display: "block",
  marginBottom: 8,
};

const businessTypes = ["Retail Shop", "Restaurant", "Salon", "Pharmacy", "Electronics", "Other"];

export default function OnboardingPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = "#7c3aed66";
    (e.target as HTMLElement).style.boxShadow = "0 0 0 3px #7c3aed14";
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = "#ffffff0d";
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ business_name: businessName, business_type: businessType, business_phone: businessPhone, business_location: businessLocation, onboarding_completed: true })
      .eq("id", user.id);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    router.push("/");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07080f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, #7c3aed0a 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #a855f706 0%, transparent 50%), url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff04' stroke-width='1'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
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
            Welcome 👋
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Set up your business profile to get started</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* BUSINESS NAME */}
          <div>
            <label style={labelStyle}>Business Name</label>
            <div style={{ position: "relative" }}>
              <Building2 size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Emmanuel Store"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* BUSINESS TYPE */}
          <div>
            <label style={labelStyle}>Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              style={selectStyle}
              onFocus={focusIn}
              onBlur={focusOut}
            >
              <option value="" style={{ background: "#161822", color: "#6b7280" }}>Select Business Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type} style={{ background: "#161822", color: "#f0f0ff" }}>{type}</option>
              ))}
            </select>
          </div>

          {/* PHONE */}
          <div>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ position: "relative" }}>
              <Phone size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+255..."
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label style={labelStyle}>Location</label>
            <div style={{ position: "relative" }}>
              <MapPin size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                placeholder="Dar es Salaam"
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
            <ChevronRight size={16} />
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
