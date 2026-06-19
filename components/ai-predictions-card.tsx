"use client";

import { BrainCircuit, AlertTriangle } from "lucide-react";

export default function AiPredictionsCard({ predictions }: { predictions: string[] }) {
  return (
    <div
      style={{
        background: "#0f1117",
        border: "1px solid #ffffff0d",
        borderRadius: 22,
        padding: "24px",
        backgroundImage:
          "radial-gradient(ellipse at top right, #f8717108 0%, transparent 55%)",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "#f8717114",
            border: "1px solid #f8717133",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BrainCircuit size={20} color="#f87171" />
        </div>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#f0f0ff", letterSpacing: "-0.02em" }}>
            AI Predictions
          </h2>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Forecasted business risks & trends
          </p>
        </div>
      </div>

      {/* LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {predictions.map((prediction, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 10,
              borderRadius: 13,
              background: "#f8717108",
              border: "1px solid #f8717118",
              padding: "12px 14px",
            }}
          >
            <AlertTriangle
              size={14}
              color="#f87171"
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{prediction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
