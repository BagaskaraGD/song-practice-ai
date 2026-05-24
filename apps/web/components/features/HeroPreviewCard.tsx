import Waveform from "@/components/ui/Waveform";
import { Key, Activity, Star, Download, Edit } from "lucide-react";
import Capo from "@/components/icons/Capo";

export default function HeroPreviewCard() {
  const metrics = [
    { label: "Kunci", val: "F#", icon: <Key size={12} />, accent: "pink" },
    { label: "BPM", val: "82", icon: <Activity size={12} />, accent: "violet" },
    { label: "Capo", val: "1", icon: <Capo size={12} />, accent: "pink" },
    { label: "Mudah", val: "G", icon: <Star size={12} />, accent: "violet" },
  ];

  const structure = [
    { n: "Intro", t: "0:00", c: "rgba(167,139,250,.5)", w: "10%" },
    { n: "Verse 1", t: "0:14", c: "rgba(244,114,182,.45)", w: "26%" },
    { n: "Chorus", t: "1:02", c: "rgba(99,102,241,.55)", w: "22%" },
    { n: "Verse 2", t: "1:40", c: "rgba(244,114,182,.45)", w: "20%" },
    { n: "Bridge", t: "2:34", c: "rgba(244,114,182,.45)", w: "12%" },
  ];

  return (
    <div
      className="card card-glow"
      style={{
        padding: 20,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))",
        boxShadow: "0 60px 120px -30px rgba(167,139,250,calc(.4 * var(--glow))), 0 20px 60px rgba(0,0,0,.5)",
      }}
    >
      {/* window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,.15)" }} />
          ))}
          <span style={{ marginLeft: 14, fontSize: 12.5, color: "var(--text-3)" }}>
            <span className="mono">songpractice.ai</span> · Tum Hi Ho — Arijit Singh.mp3
          </span>
        </div>
        <span className="badge badge-success">
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
          Selesai
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, padding: 20 }}>
        {/* Left — chord sheet */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <div className="h-3" style={{ margin: 0 }}>Tum Hi Ho</div>
            <div style={{ color: "var(--text-3)", fontSize: 14 }}>Arijit Singh · 4:22</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 18 }}>
            {metrics.map(({ label, val, icon, accent }) => (
              <div
                key={label}
                style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(0,0,0,.3)", border: "1px solid var(--border)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {icon} {label}
                </div>
                <div
                  className="mono"
                  style={{ marginTop: 4, fontSize: 18, fontWeight: 600, color: accent === "pink" ? "var(--pink)" : "var(--violet)" }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Verse 1 · Akor Mudah</div>
          <div
            className="mono"
            style={{ marginTop: 8, padding: 16, borderRadius: 14, background: "rgba(0,0,0,.3)", border: "1px solid var(--border)", fontSize: 14, lineHeight: 1.9 }}
          >
            <div>
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>G</span>&nbsp;&nbsp;&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>D/F#</span>&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>Em</span>&nbsp;&nbsp;&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>C</span>
            </div>
            <div style={{ color: "var(--text-2)" }}>Hum tere bin ab reh nahi sakte</div>
            <div>
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>G</span>&nbsp;&nbsp;&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>D/F#</span>&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>Em</span>&nbsp;&nbsp;&nbsp;
              <span style={{ color: "var(--violet)", fontWeight: 600 }}>C</span>
            </div>
            <div style={{ color: "var(--text-2)" }}>Tere bina kya wajood mera</div>
          </div>
        </div>

        {/* Right — waveform with structure */}
        <div>
          <div
            style={{ padding: 16, borderRadius: 14, background: "rgba(0,0,0,.3)", border: "1px solid var(--border)", height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Bentuk Lagu</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>0:46 / 4:22</div>
            </div>
            <div style={{ marginTop: 16, flex: 1, position: "relative", minHeight: 80 }}>
              <Waveform width={360} height={80} bars={60} seed={6.2} gap={3} id="hero-wv" />
              <div style={{ position: "absolute", left: "18%", top: 0, bottom: 0, width: 2, background: "var(--pink)", boxShadow: "0 0 12px var(--pink)" }} />
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
              {structure.map(({ n, t, c, w }) => (
                <div key={n + t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, width: 54, color: "var(--text-2)" }}>{n}</span>
                  <div style={{ height: 6, width: w, borderRadius: 3, background: c }} />
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-4)", marginLeft: "auto" }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <Download size={14} /> Unduh PDF
              </button>
              <button className="btn btn-ghost btn-sm">
                <Edit size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
