import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  big: string;
  sub: string;
  icon: ReactNode;
  accent?: "violet" | "pink";
}

export default function StatCard({ label, big, sub, icon, accent = "violet" }: StatCardProps) {
  const isPink = accent === "pink";
  return (
    <div className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: isPink ? "rgba(244,114,182,.12)" : "rgba(167,139,250,.12)",
            border: "1px solid " + (isPink ? "rgba(244,114,182,.25)" : "rgba(167,139,250,.25)"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isPink ? "var(--pink)" : "var(--violet)",
          }}
        >
          {icon}
        </div>
      </div>
      <div
        className="mono"
        style={{
          marginTop: 16,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 0,
          color: isPink ? "var(--pink)" : "var(--violet)",
        }}
      >
        {big}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "var(--text-3)" }}>{sub}</div>
    </div>
  );
}
