import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Background from "@/components/ui/Background";
import Waveform from "@/components/ui/Waveform";
import Orb from "@/components/ui/Orb";
import HeroPreviewCard from "@/components/features/HeroPreviewCard";
import PricingCard from "@/components/features/PricingCard";
import SmartCTA from "@/components/ui/SmartCTA";
import {
  Sparkles,
  Play,
  Upload,
  AudioWaveform,
  FileText,
  Music2,
  Folder,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import Capo from "@/components/icons/Capo";

const pricingPlans = [
  {
    name: "Coba Gratis",
    price: "Rp0",
    sub: "sekali pakai",
    bullets: ["1 lagu pendek (≤ 2 menit)", "Hanya akor mudah", "Tanpa unduh PDF"],
    cta: "Coba Sekarang",
    highlight: false,
  },
  {
    name: "Paket Kredit",
    price: "Rp49.000",
    sub: "15 kredit · tanpa kedaluwarsa",
    bullets: ["Bayar per lagu, tanpa langganan", "PDF latihan tersedia", "Cocok untuk pemakai sesekali"],
    cta: "Beli Kredit",
    highlight: false,
  },
  {
    name: "Bulanan Pro",
    price: "Rp99.000",
    sub: "/bulan · 60 kredit",
    bullets: [
      "Hemat untuk musisi aktif",
      "Semua fitur Not Angka & PDF",
      "Prioritas antrian analisis",
      "Riwayat lagu tak terbatas",
    ],
    cta: "Pilih Pro",
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background
        orbs={[
          { size: 900, color: "#a78bfa", x: "22%", y: "40%", opacity: 0.55, blur: 120 },
          { size: 760, color: "#f472b6", x: "80%", y: "22%", opacity: 0.5, blur: 110 },
          { size: 500, color: "#6366f1", x: "50%", y: "90%", opacity: 0.35, blur: 100 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="beranda" />

        {/* HERO */}
        <section style={{ position: "relative", padding: "60px 0 80px" }}>
          <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px 7px 8px", borderRadius: 999,
              background: "rgba(255,255,255,.04)", border: "1px solid var(--border-strong)",
              fontSize: 13, color: "var(--text-2)", marginBottom: 28,
            }}>
              <span style={{
                padding: "3px 10px", borderRadius: 999,
                background: "linear-gradient(135deg,#f472b6,#a78bfa)",
                fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: ".02em"
              }}>BARU</span>
              Sekarang dengan deteksi Not Angka untuk gitar & keyboard
              <ChevronRight size={14} />
            </div>

            <h1 className="h-display" style={{ margin: "0 auto", maxWidth: 980 }}>
              Unggah lagu, dapatkan{" "}
              <span className="gradient-text" style={{ fontStyle: "italic", fontWeight: 600 }}>chord sheet</span>
              <br />siap latihan dalam hitungan menit.
            </h1>

            <p style={{ margin: "28px auto 0", maxWidth: 640, fontSize: 19, lineHeight: 1.55, color: "var(--text-2)" }}>
              AI yang mendengar lagu favoritmu lalu menulis ulang sebagai lembar latihan
              ramah pemula — lengkap dengan kunci, BPM, akor mudah, Not Angka, dan tips.
            </p>

            <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <SmartCTA />
              <button className="btn btn-ghost btn-lg">
                <Play size={16} /> Lihat Contoh Hasil
              </button>
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 22, fontSize: 13, color: "var(--text-3)", flexWrap: "wrap" }}>
              <span>✓ 1 lagu gratis untuk coba</span>
              <span>✓ Tanpa kartu kredit</span>
              <span>✓ MP3 · WAV · M4A</span>
            </div>
          </div>

          <div style={{ position: "relative", maxWidth: 1100, margin: "72px auto 0", padding: "0 48px", zIndex: 2 }}>
            <HeroPreviewCard />
            <div style={{
              position: "absolute", left: "50%", bottom: -40, transform: "translateX(-50%)",
              width: 700, height: 200, pointerEvents: "none",
              background: "radial-gradient(60% 60% at 50% 0%, rgba(167,139,250, calc(.5 * var(--glow))) 0%, transparent 70%)",
              filter: "blur(20px)",
            }} />
          </div>

          <div className="container" style={{ marginTop: 100, textAlign: "center" }}>
            <div className="eyebrow" style={{ marginBottom: 22 }}>Dipercaya oleh musisi & tim gereja di seluruh Indonesia</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 56, opacity: 0.55, flexWrap: "wrap" }}>
              {["JKT WORSHIP", "Saung Musik", "GuitarHub.id", "Studio Senja", "Bandung Praise", "Cover Lab"].map((l) => (
                <span key={l} style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".04em", color: "var(--text-3)" }}>{l}</span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="fitur" style={{ padding: "120px 0 80px", position: "relative" }}>
          <div className="container">
            <div className="section-intro section-intro-center">
              <div className="eyebrow">Cara Kerja</div>
              <h2 className="h-1 section-title">Tiga langkah, satu lembar latihan.</h2>
              <p className="section-copy">
              Dari file audio sampai chord sheet yang siap dicetak — semuanya otomatis.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 60 }}>
              {[
                { n: "01", title: "Unggah lagu", body: "Tarik file MP3/WAV/M4A milikmu, atau tempel link. Maksimal 8 menit per lagu.", icon: <Upload size={22} /> },
                { n: "02", title: "AI mendengarkan", body: "Mendeteksi kunci, BPM, akor, melodi, dan struktur lagu — biasanya di bawah 60 detik.", icon: <AudioWaveform size={22} /> },
                { n: "03", title: "Latihan & unduh", body: "Buka lembar latihanmu di browser, atau unduh PDF untuk dibawa ke studio.", icon: <FileText size={22} /> },
              ].map((s, i) => (
                <div key={s.n} className="card card-glow" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                  <div className="mono" style={{ fontWeight: 600, fontSize: 13, color: "var(--violet)", letterSpacing: ".08em" }}>{s.n}</div>
                  <div style={{
                    marginTop: 22, width: 52, height: 52, borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(244,114,182,.18), rgba(167,139,250,.14))",
                    border: "1px solid var(--border-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--pink)"
                  }}>
                    {s.icon}
                  </div>
                  <h3 className="h-3" style={{ marginTop: 22, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: "var(--text-3)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>{s.body}</p>
                  {i < 2 && (
                    <div style={{ position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)" }}>
                      <ChevronRight size={28} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section style={{ padding: "80px 0", position: "relative" }}>
          <div className="container">
            <div className="section-header-row" style={{ marginBottom: 56 }}>
              <div className="section-intro">
                <div className="eyebrow">Apa yang kamu dapatkan</div>
                <h2 className="h-1 section-title">Sebuah lembar latihan, bukan dump teknis.</h2>
              </div>
              <p className="section-copy" style={{ maxWidth: 420 }}>
                Setiap hasil disusun seperti chord sheet manual yang dibuat seorang teman musisi —
                jelas, simpel, langsung bisa dimainkan.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridAutoRows: 220, gap: 16 }}>
              {/* Akor Original */}
              <div className="card" style={{ gridColumn: "span 3", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(244,114,182,.25),rgba(244,114,182,.05))", border: "1px solid rgba(244,114,182,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pink)" }}>
                    <Music2 size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Akor Original</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Akor lagu di kunci aslinya, lengkap dengan posisi bar dan timing kasar.</p>
                <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["F#", "C#", "D#m", "B", "F#", "C#", "G#m", "B"].map((c, i) => (
                    <span key={i} className="chord chord-pink" style={{ minWidth: 54, height: 52, fontSize: 18 }}>{c}</span>
                  ))}
                </div>
              </div>
              {/* Akor Mudah + Capo */}
              <div className="card" style={{ gridColumn: "span 3", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(167,139,250,.25),rgba(167,139,250,.05))", border: "1px solid rgba(167,139,250,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--violet)" }}>
                    <Capo size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Akor Mudah + Capo</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Versi yang lebih bersahabat untuk pemula, plus saran capo agar tetap di kunci asli.</p>
                <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["G", "D", "Em", "C"].map((c, i) => (
                      <span key={i} className="chord chord-violet" style={{ minWidth: 48, height: 48, fontSize: 16 }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ padding: "8px 14px", borderRadius: 12, background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.3)", fontSize: 13, color: "#c4b5fd", display: "flex", alignItems: "center", gap: 6 }}>
                    <Capo size={16} stroke="#c4b5fd" /> <b className="mono">Capo 1</b>
                  </div>
                </div>
              </div>
              {/* Not Angka */}
              <div className="card" style={{ gridColumn: "span 2", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(244,114,182,.25),rgba(244,114,182,.05))", border: "1px solid rgba(244,114,182,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pink)" }}>
                    <AudioWaveform size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Not Angka</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Melodi utama dalam notasi angka — bahasa universal musisi Indonesia.</p>
                <div className="mono" style={{ marginTop: "auto", paddingTop: 8, padding: "12px 14px", borderRadius: 12, background: "rgba(0,0,0,.3)", border: "1px solid var(--border)", fontSize: 22, letterSpacing: ".16em", color: "var(--text)" }}>
                  <span style={{ color: "var(--pink)" }}>5</span> 6 <span style={{ color: "var(--violet)" }}>1̇</span> 1̇ 7 6 <span style={{ color: "var(--pink)" }}>5</span>
                </div>
              </div>
              {/* Struktur Lagu */}
              <div className="card" style={{ gridColumn: "span 2", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(167,139,250,.25),rgba(167,139,250,.05))", border: "1px solid rgba(167,139,250,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--violet)" }}>
                    <Folder size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Struktur Lagu</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Intro, Verse, Chorus, Bridge — semua bagian dipetakan dengan timing.</p>
                <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                  {[["Intro","0:00","12%","rgba(167,139,250,.4)"],["Verse","0:14","28%","rgba(244,114,182,.4)"],["Chorus","1:02","22%","rgba(99,102,241,.5)"],["Bridge","2:34","14%","rgba(244,114,182,.4)"]].map(([n,t,w,c]) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, width: 50, color: "var(--text-3)" }}>{n}</span>
                      <div style={{ height: 8, width: w, borderRadius: 4, background: c }} />
                      <span className="mono" style={{ fontSize: 10, color: "var(--text-4)" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* PDF */}
              <div className="card" style={{ gridColumn: "span 2", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(244,114,182,.25),rgba(244,114,182,.05))", border: "1px solid rgba(244,114,182,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pink)" }}>
                    <FileText size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>PDF Latihan</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Cetak siap pakai untuk dibawa ke gereja atau studio — tanpa watermark.</p>
                <div style={{ marginTop: "auto", paddingTop: 8, position: "relative", height: 80 }}>
                  <div style={{ position: "absolute", left: 14, top: 0, width: 68, height: 88, background: "linear-gradient(180deg,#fff,#e9e6f0)", borderRadius: 6, boxShadow: "0 10px 24px rgba(0,0,0,.4)", transform: "rotate(-6deg)", padding: "8px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ height: 4, width: "70%", background: "#0a0613", borderRadius: 1 }} />
                    {Array.from({ length: 5 }).map((_,i) => <div key={i} style={{ height: 2, width: `${88-i*10}%`, background: "#9b94a6", borderRadius: 1 }} />)}
                  </div>
                  <div style={{ position: "absolute", left: 52, top: 4, width: 68, height: 88, background: "linear-gradient(180deg,#fff,#e9e6f0)", borderRadius: 6, boxShadow: "0 10px 24px rgba(0,0,0,.5)", transform: "rotate(8deg)", padding: "8px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ height: 4, width: "60%", background: "linear-gradient(90deg,#f472b6,#a78bfa)", borderRadius: 1 }} />
                    {Array.from({ length: 5 }).map((_,i) => <div key={i} style={{ height: 2, width: `${90-i*8}%`, background: "#9b94a6", borderRadius: 1 }} />)}
                  </div>
                </div>
              </div>
              {/* Tips */}
              <div className="card" style={{ gridColumn: "span 2", padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(167,139,250,.25),rgba(167,139,250,.05))", border: "1px solid rgba(167,139,250,.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--violet)" }}>
                    <Lightbulb size={16} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Tips Latihan</h3>
                </div>
                <p style={{ margin: "10px 0 0", color: "var(--text-3)", fontSize: 14, lineHeight: 1.5 }}>Saran spesifik untuk lagu ini — bukan tips generik dari buku.</p>
                <div style={{ marginTop: "auto", padding: 12, borderRadius: 12, background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.18)", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.45 }}>
                  💡 <i>&ldquo;Mulai dengan akor mudah di G, lalu pindah ke F# saat sudah nyaman dengan transisi.&rdquo;</i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section style={{ padding: "100px 0", position: "relative" }}>
          <div className="container">
            <div className="section-intro section-intro-center" style={{ marginBottom: 56 }}>
              <div className="eyebrow">Harga</div>
              <h2 className="h-1 section-title">Bayar per lagu, atau langganan.</h2>
              <p className="section-copy">
                Pakai sesekali? Beli paket kredit. Latihan tiap hari? Langganan bulanan lebih hemat.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} compact />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: "100px 0 140px", position: "relative" }}>
          <div className="container">
            <div className="card card-glow" style={{
              padding: "72px 64px", textAlign: "center", position: "relative", overflow: "hidden",
              background: "linear-gradient(180deg, rgba(167,139,250,.10), rgba(244,114,182,.05))",
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
                <Waveform width={1200} height={200} bars={140} seed={4.4} gap={3} id="cta-wv" />
              </div>
              <Orb size={500} color="#f472b6" x="20%" y="100%" opacity={0.55} />
              <Orb size={500} color="#a78bfa" x="80%" y="0%" opacity={0.55} />
              <div className="section-intro section-intro-center" style={{ position: "relative" }}>
                <h2 className="h-1 section-title">
                  Lagu favoritmu, siap dilatih malam ini.
                </h2>
                <p className="section-copy" style={{ maxWidth: 560 }}>
                  Coba gratis dengan 1 lagu pendek. Tanpa kartu, tanpa langganan otomatis.
                </p>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                  <Link href="/unggah" className="btn btn-primary btn-lg">
                    <Sparkles size={18} /> Mulai Sekarang
                  </Link>
                  <button className="btn btn-ghost btn-lg">
                    Lihat Contoh Hasil <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
