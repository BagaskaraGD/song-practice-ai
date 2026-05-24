import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  big: string;
  sub: string;
  icon: ReactNode;
  accent?: "violet" | "pink";
  footnote?: string;
}

export default function MetricCard({ label, big, sub, icon, accent = "violet", footnote }: MetricCardProps) {
  const isPink = accent === "pink";
  return (
    <div className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: 999,
          background: isPink
            ? "radial-gradient(circle, rgba(244,114,182,calc(.35 * var(--glow))), transparent 70%)"
            : "radial-gradient(circle, rgba(167,139,250,calc(.35 * var(--glow))), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: isPink ? "var(--pink)" : "var(--violet)" }}>{icon}</span>
        {label}
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          className="mono"
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 0,
            color: isPink ? "var(--pink)" : "var(--violet)",
            textShadow: `0 0 30px ${isPink ? "rgba(244,114,182, calc(.5 * var(--glow)))" : "rgba(167,139,250, calc(.5 * var(--glow)))"}`,
          }}
        >
          {big}
        </span>
        <span style={{ fontSize: 14, color: "var(--text-2)" }}>{sub}</span>
      </div>
      {footnote && <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-4)" }}>{footnote}</div>}
    </div>
  );
}
