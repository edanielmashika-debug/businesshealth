"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/dashboard-layout";
import { supabase } from "../../lib/supabase";
import { Camera, LogOut, Save, Building2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  display: "block",
  marginBottom: 8,
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error || !data) {
        await supabase.from("profiles").insert({ id: user.id, business_name: "", logo_url: "" });
        return;
      }
      setBusinessName(data.business_name || "");
      setLogoUrl(data.logo_url || "");
    }
    loadProfile();
  }, [router]);

  async function handleSave() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ id: user.id, business_name: businessName, logo_url: logoUrl });
    if (error) { toast.error(error.message); } else { toast.success("Profile updated successfully"); }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("profiles").upload(fileName, file, { upsert: true });
      if (uploadError) { toast.error(uploadError.message); setLoading(false); return; }
      const { data: publicUrlData } = supabase.storage.from("profiles").getPublicUrl(fileName);
      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      setLogoUrl(publicUrl);
      await supabase.from("profiles").update({ id: user.id, business_name: businessName, logo_url: publicUrl });
      setLoading(false);
    } catch (error) { console.log(error); setLoading(false); }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const focusIn = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#7c3aed66"; e.target.style.boxShadow = "0 0 0 3px #7c3aed14"; };
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#ffffff0d"; e.target.style.boxShadow = "none"; };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

        {/* HERO — logo + name */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 22,
            background: "#0f1117",
            border: "1px solid #7c3aed22",
            padding: "28px 28px",
            backgroundImage: "radial-gradient(ellipse at top right, #7c3aed14 0%, transparent 55%)",
            boxShadow: "0 0 60px #7c3aed08",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#7c3aed18", border: "1px solid #7c3aed33", color: "#c4b5fd", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                <ShieldCheck size={11} />
                Business Profile
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#f0f0ff", letterSpacing: "-0.03em", marginBottom: 6 }}>
                Manage Your Account
              </h1>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, maxWidth: 360 }}>
                Customize your business identity, upload your logo, and manage account details.
              </p>
            </div>

            {/* LOGO UPLOAD */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "#7c3aed18",
                    border: "1px solid #7c3aed33",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 24px #7c3aed22",
                  }}
                >
                  {logoUrl
                    ? <img src={logoUrl} alt="Business Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#c4b5fd", fontSize: 36, fontWeight: 900 }}>{businessName?.charAt(0)?.toUpperCase() || "B"}</span>
                  }
                </div>
                <label
                  style={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px #7c3aed44",
                    color: "#fff",
                  }}
                >
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
              </div>
              <p style={{ fontSize: 11, color: "#6b7280" }}>Upload logo</p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #ffffff0d",
            borderRadius: 22,
            padding: "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#7c3aed18", border: "1px solid #7c3aed33", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={18} color="#c4b5fd" />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.01em" }}>Business Information</h2>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Update your business identity and account details</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* BUSINESS NAME */}
            <div>
              <label style={labelStyle}>Business Name</label>
              <div style={{ position: "relative" }}>
                <Building2 size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="My Business"
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            {/* EMAIL (readonly) */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={14} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <div
                  style={{
                    width: "100%",
                    borderRadius: 13,
                    border: "1px solid #ffffff08",
                    background: "#0d0e15",
                    padding: "13px 16px 13px 44px",
                    fontSize: 14,
                    color: "#4b5563",
                    boxSizing: "border-box",
                  }}
                >
                  {email}
                </div>
              </div>
            </div>

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 4,
                background: loading ? "#7c3aed55" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                color: "#fff",
                borderRadius: 13,
                padding: "13px 0",
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
              onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <Save size={15} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* LOGOUT CARD */}
        <div
          style={{
            background: "#0f1117",
            border: "1px solid #ef444420",
            borderRadius: 22,
            padding: "20px 26px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            backgroundImage: "radial-gradient(ellipse at top right, #ef444408 0%, transparent 55%)",
          }}
        >
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0ff" }}>Logout Session</h2>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Securely sign out from your business dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "#ef444408",
              border: "1px solid #ef444433",
              color: "#f87171",
              borderRadius: 12,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444416"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ef444408"; }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
