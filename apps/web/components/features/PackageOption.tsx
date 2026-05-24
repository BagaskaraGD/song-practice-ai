"use client";

interface PackageOptionProps {
  label: string;
  credits: number;
  desc: string;
  items: string[];
  selected?: boolean;
  onSelect?: () => void;
}

export default function PackageOption({ label, credits, desc, items, selected = false, onSelect }: PackageOptionProps) {
  return (
    <label
      onClick={onSelect}
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        borderRadius: 14,
        cursor: "pointer",
        background: selected
          ? "linear-gradient(180deg, rgba(244,114,182,.10), rgba(167,139,250,.06))"
          : "rgba(0,0,0,.18)",
        border: "1px solid " + (selected ? "rgba(244,114,182,.4)" : "var(--border)"),
        boxShadow: selected
          ? "0 0 0 1px rgba(244,114,182,.2), 0 12px 30px -10px rgba(244,114,182, calc(.4 * var(--glow)))"
          : "none",
        transition: "all .15s",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          flex: "0 0 auto",
          marginTop: 2,
          background: selected ? "var(--grad-brand)" : "transparent",
          border: "1.5px solid " + (selected ? "transparent" : "var(--border-strong)"),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <span style={{ width: 8, height: 8, borderRadius: 999, background: "#fff" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              className="mono"
              style={{ fontSize: 22, fontWeight: 700, color: selected ? "var(--pink)" : "var(--text-2)" }}
            >
              {credits}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>kredit</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>{desc}</div>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 11.5,
                padding: "3px 9px",
                borderRadius: 6,
                background: "rgba(255,255,255,.04)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </label>
  );
}
