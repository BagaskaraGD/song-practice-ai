import { Play } from "lucide-react";

interface NotAngkaLine {
  label: string;
  notes: string[];
  highlight?: number[];
  dim?: boolean;
}

function NoteLine({ label, notes, highlight = [], dim = false }: NotAngkaLine) {
  return (
    <div>
      <div
        style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}
      >
        {label}
      </div>
      <div
        className="mono"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 14px",
          fontSize: 24,
          letterSpacing: ".04em",
          color: dim ? "var(--text-3)" : "var(--text-2)",
        }}
      >
        {notes.map((n, i) => (
          <span
            key={i}
            style={{
              color:
                n === "—"
                  ? "var(--text-4)"
                  : highlight.includes(i)
                  ? "var(--pink)"
                  : "inherit",
              fontWeight: highlight.includes(i) ? 600 : 400,
              textShadow: highlight.includes(i)
                ? "0 0 14px rgba(244,114,182, calc(.5 * var(--glow)))"
                : "none",
            }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

interface NotAngkaCardProps {
  lines: NotAngkaLine[];
}

export default function NotAngkaCard({ lines }: NotAngkaCardProps) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow">Not Angka · Melodi Utama</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
            <span className="mono">do = G</span> · oktaf tengah · titik atas = oktaf atas
          </div>
        </div>
        <button className="btn btn-ghost btn-sm">
          <Play size={12} /> Dengarkan
        </button>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 24,
          borderRadius: 14,
          background: "rgba(0,0,0,.3)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {lines.map((line, i) => (
          <NoteLine key={i} {...line} />
        ))}
      </div>
    </div>
  );
}
