"use client";

import { Sparkles, ChevronRight } from "lucide-react";

export default function AiRecommendationsCard({
  recommendations,
}: {
  recommendations: string[];
}) {
  return (
    <div
      style={{
        background: "#0f1117",
        border: "1px solid #ffffff0d",
        borderRadius: 22,
        padding: "24px",
        backgroundImage:
          "radial-gradient(ellipse at top right, #06ffa508 0%, transparent 55%)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "#06ffa510",
            border: "1px solid #06ffa522",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles size={20} color="#06ffa5" />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            AI Recommendations
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Smart actions for business growth
          </p>
        </div>
      </div>

      {/* LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 10,
              borderRadius: 13,
              background: "#06ffa506",
              border: "1px solid #06ffa514",
              padding: "12px 14px",
              alignItems: "flex-start",
            }}
          >
            <ChevronRight
              size={14}
              color="#06ffa5"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
