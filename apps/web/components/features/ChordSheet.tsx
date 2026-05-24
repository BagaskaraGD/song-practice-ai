interface ChordLine {
  chords: [string, number][];
  text: string;
}

interface Section {
  label: string;
  accent?: boolean;
  lines: ChordLine[];
}

const sections: Section[] = [
  {
    label: "Intro",
    lines: [
      { chords: [["G", 0], ["D", 12], ["Em", 22], ["C", 32]], text: "" },
    ],
  },
  {
    label: "Verse 1",
    lines: [
      { chords: [["G", 0], ["D/F#", 10], ["Em", 22], ["C", 32]], text: "Hum tere bin ab reh nahi sakte" },
      { chords: [["G", 0], ["D/F#", 10], ["Em", 22], ["C", 32]], text: "Tere bina kya wajood mera" },
      { chords: [["G", 0], ["D", 12], ["Em", 22], ["C", 32]], text: "Tujhse juda gar ho jayenge" },
      { chords: [["Am", 0], ["D", 12], ["G", 22]], text: "Toh khud se hi ho jayenge judaa" },
    ],
  },
  {
    label: "Chorus",
    accent: true,
    lines: [
      { chords: [["C", 0], ["G", 14], ["D", 26], ["Em", 38]], text: "Kyunki tum hi ho" },
      { chords: [["C", 0], ["G", 14], ["D", 26], ["Em", 38]], text: "Ab tum hi ho" },
      { chords: [["Am", 0], ["G", 14], ["D", 26]], text: "Zindagi ab tum hi ho" },
      { chords: [["C", 0], ["D", 16], ["G", 26]], text: "Chain bhi, mera dard bhi" },
    ],
  },
  {
    label: "Bridge",
    lines: [
      { chords: [["Em", 0], ["C", 14], ["G", 26], ["D", 38]], text: "Tera mera rishta hai kaisa" },
      { chords: [["Em", 0], ["C", 14], ["G", 26], ["D", 38]], text: "Ek pal door gawara nahi" },
    ],
  },
];

export default function ChordSheet() {
  return (
    <div style={{ padding: "24px 28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px dashed var(--border)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0 }}>Tum Hi Ho</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
            Arijit Singh · Kunci:{" "}
            <span className="mono" style={{ color: "var(--text-2)" }}>F#</span> · Mudah:{" "}
            <span className="mono" style={{ color: "var(--violet)" }}>G</span>+
            <span className="mono" style={{ color: "var(--violet)" }}> Capo 1</span> · BPM{" "}
            <span className="mono" style={{ color: "var(--text-2)" }}>82</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["G", "D", "Em", "C", "Am", "D/F#"].map((c) => (
            <span key={c} className="chord chord-violet" style={{ height: 32, minWidth: 36, fontSize: 13, padding: "0 8px" }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 22 }}>
        {sections.map((s, si) => (
          <div key={si}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 10px",
                borderRadius: 6,
                background: s.accent ? "rgba(99,102,241,.18)" : "rgba(167,139,250,.12)",
                border: "1px solid " + (s.accent ? "rgba(99,102,241,.35)" : "rgba(167,139,250,.25)"),
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: s.accent ? "#c7d2fe" : "#c4b5fd",
              }}
            >
              {s.label}
            </div>
            <div className="mono" style={{ marginTop: 10, fontSize: 14, lineHeight: 2.1 }}>
              {s.lines.map((ln, li) => (
                <div key={li} style={{ position: "relative", whiteSpace: "pre" }}>
                  <div style={{ height: 22, position: "relative" }}>
                    {ln.chords.map(([c, ch], ci) => (
                      <span
                        key={ci}
                        style={{
                          position: "absolute",
                          left: `${ch}ch`,
                          color: "var(--violet)",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div style={{ color: "var(--text-2)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 14 }}>
                    {ln.text || <span style={{ opacity: 0.3 }}>—</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
