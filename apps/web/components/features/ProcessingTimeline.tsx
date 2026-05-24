import { Check } from "lucide-react";

interface Step {
  title: string;
  desc: string;
  status: "done" | "active" | "pending";
  time: string;
}

function StepDot({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") {
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "linear-gradient(135deg,#34d399,#22d3ee)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 16px rgba(52,211,153, calc(.4 * var(--glow)))",
          color: "#fff",
        }}
      >
        <Check size={16} />
      </div>
    );
  }
  if (status === "active") {
    return (
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            background: "linear-gradient(135deg,#f472b6,#a78bfa)",
            boxShadow: "0 0 24px rgba(244,114,182, calc(.6 * var(--glow)))",
          }}
        />
        <div
          style={{ position: "absolute", inset: -6, borderRadius: 999, border: "2px solid rgba(244,114,182,.3)" }}
        />
        <div style={{ position: "absolute", inset: 10, borderRadius: 999, background: "#fff" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 999,
        background: "rgba(255,255,255,.04)",
        border: "1.5px solid var(--border-strong)",
      }}
    />
  );
}

export default function ProcessingTimeline({ steps }: { steps: Step[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 80px",
            gap: 18,
            padding: "14px 0",
            borderTop: i ? "1px dashed var(--border)" : "none",
          }}
        >
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <StepDot status={step.status} />
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 34,
                  bottom: -28,
                  width: 2,
                  background:
                    step.status === "done"
                      ? "linear-gradient(180deg,#a78bfa,#a78bfa)"
                      : step.status === "active"
                      ? "linear-gradient(180deg,#a78bfa,rgba(167,139,250,.08))"
                      : "rgba(255,255,255,.06)",
                }}
              />
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: step.status === "pending" ? "var(--text-3)" : "var(--text)",
              }}
            >
              {step.title}
              {step.status === "active" && (
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: 11.5,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: "rgba(244,114,182,.12)",
                    border: "1px solid rgba(244,114,182,.25)",
                    color: "var(--pink)",
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                  }}
                >
                  sedang diproses
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>{step.desc}</div>
            {step.status === "active" && (
              <div
                style={{
                  marginTop: 12,
                  height: 4,
                  borderRadius: 4,
                  background: "rgba(255,255,255,.05)",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "62%", height: "100%", background: "var(--grad-brand)" }} />
              </div>
            )}
          </div>
          <span
            className="mono"
            style={{
              fontSize: 13,
              alignSelf: "flex-start",
              textAlign: "right",
              color: step.status === "pending" ? "var(--text-4)" : "var(--text-3)",
            }}
          >
            {step.time}
          </span>
        </div>
      ))}
    </div>
  );
}
