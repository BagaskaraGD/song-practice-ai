import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  sub: string;
  bullets: string[];
  cta: string;
  highlight?: boolean;
  compact?: boolean;
  onCta?: () => void;
}

export default function PricingCard({ name, price, sub, bullets, cta, highlight = false, compact = false, onCta }: PricingCardProps) {
  return (
    <div
      className={`card ${highlight ? "card-glow" : ""}`}
      style={{
        padding: compact ? 28 : 32,
        position: "relative",
        overflow: "hidden",
        background: highlight
          ? "linear-gradient(180deg, rgba(244,114,182,.10), rgba(167,139,250,.06))"
          : "var(--card)",
        borderColor: highlight ? "rgba(244,114,182,.35)" : "var(--border)",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "4px 10px",
            borderRadius: 999,
            background: "linear-gradient(135deg,#f472b6,#a78bfa)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".04em",
            color: "#fff",
          }}
        >
          PALING POPULER
        </div>
      )}
      <div style={{ fontSize: 14, color: "var(--text-3)" }}>{name}</div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 6 }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 0 }}>{price}</div>
        <div style={{ fontSize: 13, color: "var(--text-3)" }}>{sub}</div>
      </div>
      <div style={{ height: 1, background: "var(--border)", margin: "22px 0" }} />
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-2)" }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                marginTop: 1,
                background: highlight ? "rgba(244,114,182,.2)" : "rgba(167,139,250,.16)",
                border: `1px solid ${highlight ? "rgba(244,114,182,.4)" : "rgba(167,139,250,.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: highlight ? "var(--pink)" : "var(--violet)",
                flex: "0 0 auto",
              }}
            >
              <Check size={11} />
            </span>
            {b}
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        className={`btn ${highlight ? "btn-primary" : "btn-ghost"} btn-md`}
        style={{ marginTop: 28, width: "100%" }}
      >
        {cta}
      </button>
    </div>
  );
}
