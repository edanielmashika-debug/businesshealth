"use client";

import { Sparkles, Brain } from "lucide-react";

export default function AiInsightsCard({ insights }: { insights: string[] }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0f1117",
        borderRadius: 22,
        border: "1px solid #7c3aed22",
        padding: "24px",
        backgroundImage:
          "radial-gradient(ellipse at top right, #7c3aed12 0%, transparent 55%), radial-gradient(ellipse at bottom left, #a855f708 0%, transparent 50%)",
        boxShadow: "0 0 40px #7c3aed08",
      }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%237c3aed08' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3C/g%3E%3C/svg%3E\")",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "#7c3aed18",
            border: "1px solid #7c3aed33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Brain size={20} color="#c4b5fd" />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            AI Business Insights
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Smart recommendations for your business
          </p>
        </div>
      </div>

      {/* INSIGHTS LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        {insights.map((insight, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "#7c3aed0a",
              border: "1px solid #7c3aed1a",
              borderRadius: 13,
              padding: "12px 14px",
            }}
          >
            <Sparkles
              size={14}
              color="#c4b5fd"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
