"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Background from "@/components/ui/Background";
import PricingCard from "@/components/features/PricingCard";
import { api } from "@/lib/api";
import { Check, X, Music2, AudioWaveform, FileText } from "lucide-react";
import Capo from "@/components/icons/Capo";

const plans = [
  {
    id: "free",
    name: "Coba Gratis",
    price: "Rp0",
    sub: "sekali pakai",
    desc: "Cek dulu apakah hasilnya sesuai dengan ekspektasimu.",
    bullets: ["1 lagu pendek (≤ 2 menit)", "Hanya akor mudah", "Tanpa Not Angka", "Tanpa unduh PDF"],
    cta: "Coba Sekarang",
    highlight: false,
    product: null,
  },
  {
    id: "credit_15",
    name: "Paket Kredit",
    price: "Rp49.000",
    sub: "sekali bayar · 15 kredit",
    desc: "Cocok untuk yang main musik di akhir pekan.",
    bullets: ["15 kredit, tanpa kedaluwarsa", "Bayar per lagu", "Semua fitur PDF & Not Angka", "Riwayat lagu 30 hari"],
    cta: "Beli Kredit",
    highlight: false,
    product: "credit_15",
  },
  {
    id: "pro_monthly",
    name: "Bulanan Pro",
    price: "Rp99.000",
    sub: "/bulan · 60 kredit",
    desc: "Untuk musisi aktif, band, dan tim worship.",
    bullets: ["60 kredit per bulan", "Prioritas antrian analisis", "Semua fitur Not Angka & PDF", "Riwayat tak terbatas", "Share hasil ke anggota tim"],
    cta: "Pilih Pro",
    highlight: true,
    product: "pro_monthly",
  },
];

const creditExplainer = [
  { c: 1, t: "Analisis Akor Mudah", d: "Kunci, BPM, dan akor versi pemula", icon: <Music2 size={20} /> },
  { c: 2, t: "Original + Akor Mudah", d: "Plus akor di kunci aslinya + saran capo", icon: <Capo size={20} /> },
  { c: 4, t: "Lembar Latihan Lengkap", d: "Semua di atas + Not Angka + struktur lagu", icon: <AudioWaveform size={20} /> },
  { c: 5, t: "Lengkap + PDF & Tips", d: "Plus PDF siap cetak dan tips latihan AI", icon: <FileText size={20} /> },
];

const comparisonRows = [
  { feature: "Kunci & BPM", free: true, pack: true, pro: true },
  { feature: "Akor mudah", free: true, pack: true, pro: true },
  { feature: "Akor original", free: false, pack: true, pro: true },
  { feature: "Saran capo", free: false, pack: true, pro: true },
  { feature: "Not Angka melodi", free: false, pack: true, pro: true },
  { feature: "Struktur lagu", free: false, pack: true, pro: true },
  { feature: "PDF lembar latihan", free: false, pack: true, pro: true },
  { feature: "Tips latihan AI", free: false, pack: "tambah 1k", pro: true },
  { feature: "Riwayat lagu", free: false, pack: "30 hari", pro: "Tak terbatas" },
  { feature: "Share ke tim", free: false, pack: false, pro: true },
];

const faqs = [
  ["Apa yang terjadi kalau AI salah deteksi akor?", "Kamu bisa edit hasil di halaman analisis. Kalau koreksinya banyak, kontak kami — kredit bisa kami kembalikan."],
  ["Apakah kredit hangus?", "Tidak. Kredit dari paket kredit tidak punya tanggal kedaluwarsa. Kredit bulanan akan reset tiap bulan, tapi tidak menumpuk."],
  ["Bisa upload lagu dari YouTube?", "Belum, untuk saat ini kami hanya menerima file audio (MP3, WAV, M4A) sampai 50 MB atau 8 menit per lagu."],
  ["Apakah hasil saya bisa diakses orang lain?", "Tidak. Semua analisis privat untuk akunmu. File audio asli kami hapus 30 hari setelah upload."],
];

function CellCheck({ val }: { val: boolean | string }) {
  if (val === false) return <X size={16} style={{ color: "var(--text-4)" }} />;
  if (val === true) return <Check size={16} style={{ color: "var(--success)" }} />;
  return <span style={{ fontSize: 12, color: "var(--violet)" }}>{val}</span>;
}

export default function PricingPage() {
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  async function handleCheckout(product: string | null, planName: string) {
    if (!product) {
      setCheckoutMsg(`"${planName}" tersedia tanpa pembayaran. Langsung daftar dan mulai!`);
      return;
    }
    setCheckoutLoading(product);
    setCheckoutMsg(null);
    try {
      const session = await api.createCheckout({ product });
      // Stub: payment is not real — show the URL rather than redirecting
      setCheckoutMsg(
        `[STUB] Checkout dibuat untuk ${session.productName}. URL pembayaran: ${session.paymentUrl} — Integrasi payment gateway belum aktif.`
      );
    } catch (e: unknown) {
      setCheckoutMsg(`Gagal membuat sesi checkout: ${e instanceof Error ? e.message : "kesalahan tidak diketahui"}`);
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background
        orbs={[
          { size: 800, color: "#a78bfa", x: "50%", y: "-10%", opacity: 0.55, blur: 140 },
          { size: 500, color: "#f472b6", x: "80%", y: "50%", opacity: 0.35, blur: 120 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="harga" />

        {/* Hero */}
        <section style={{ position: "relative", padding: "60px 0 40px" }}>
          <div className="container">
            <div className="page-intro page-intro-center">
              <div className="eyebrow">Harga</div>
              <h1 className="h-1 page-title">
                Mulai gratis. Bayar saat kamu butuh lebih.
              </h1>
              <p className="page-copy" style={{ maxWidth: 580 }}>
              Sistem kredit sederhana. Setiap analisis pakai 1–5 kredit tergantung kebutuhanmu. Tanpa langganan tersembunyi.
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
              <div style={{ display: "inline-flex", padding: 4, borderRadius: 999, background: "var(--card-strong)", border: "1px solid var(--border)" }}>
              {["Bulanan", "Tahunan · hemat 20%"].map((t, i) => (
                <button
                  key={t}
                  style={{
                    padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                    background: i === 0 ? "var(--grad-brand)" : "transparent",
                    color: i === 0 ? "#fff" : "var(--text-3)",
                    border: 0, cursor: "pointer"
                  }}
                >
                  {t}
                </button>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Checkout feedback */}
        {checkoutMsg && (
          <div style={{ maxWidth: 860, margin: "0 auto 24px", padding: "0 20px" }}>
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.3)", color: "var(--text-2)", fontSize: 13.5, lineHeight: 1.6 }}>
              {checkoutMsg}
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <section style={{ position: "relative", padding: "40px 0 80px" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {plans.map((p) => (
                <PricingCard
                  key={p.name}
                  name={p.name}
                  price={p.price}
                  sub={p.sub}
                  bullets={p.bullets}
                  cta={checkoutLoading === p.product ? "Memproses…" : p.cta}
                  highlight={p.highlight}
                  onCta={() => handleCheckout(p.product, p.name)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Credit explainer */}
        <section style={{ position: "relative", padding: "40px 0 80px" }}>
          <div className="container">
            <div className="card" style={{ padding: 40 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "center" }}>
                <div className="section-intro">
                  <div className="eyebrow">Bagaimana kredit dipakai?</div>
                  <h2 className="h-2 section-title">1 lagu, hingga 5 kredit.</h2>
                  <p className="section-copy" style={{ fontSize: 15 }}>
                    Kamu pilih kedalaman analisis di halaman unggah. Mau cuma akor mudah?
                    1 kredit. Mau lembar latihan lengkap dengan Not Angka dan PDF? 4–5 kredit.
                  </p>
                  <p style={{ margin: 0, color: "var(--text-3)", fontSize: 14, lineHeight: 1.6 }}>
                    Kredit tidak hangus. Re-analisis lagu yang sama gratis dalam 7 hari pertama.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {creditExplainer.map((p) => (
                    <div
                      key={p.c}
                      style={{
                        display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 16, alignItems: "center",
                        padding: "14px 18px", borderRadius: 14,
                        background: "rgba(0,0,0,.25)", border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        className="mono"
                        style={{ fontSize: 32, fontWeight: 700, letterSpacing: 0, background: "var(--grad-brand)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                      >
                        {p.c}<span style={{ fontSize: 14, opacity: 0.6 }}>k</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.t}</div>
                        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{p.d}</div>
                      </div>
                      <div style={{ color: "var(--text-3)" }}>{p.icon}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ position: "relative", padding: "20px 0 80px" }}>
          <div className="container">
            <div className="section-intro section-intro-center" style={{ marginBottom: 36 }}>
              <h2 className="h-2">Perbandingan paket</h2>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", fontSize: 13 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", color: "var(--text-3)" }} />
                {["Coba Gratis", "Paket Kredit", "Bulanan Pro"].map((h, i) => (
                  <div
                    key={h}
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      borderLeft: "1px solid var(--border)",
                      fontWeight: 600,
                      color: i === 2 ? "var(--pink)" : "var(--text)",
                      textAlign: "center",
                    }}
                  >
                    {h}
                  </div>
                ))}
                {comparisonRows.map((row, ri) => (
                  <>
                    <div key={`f-${ri}`} style={{ padding: "12px 20px", borderBottom: ri < comparisonRows.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-2)", fontSize: 14 }}>{row.feature}</div>
                    {(["free", "pack", "pro"] as const).map((key) => (
                      <div
                        key={key}
                        style={{
                          padding: "12px 20px",
                          borderBottom: ri < comparisonRows.length - 1 ? "1px solid var(--border)" : "none",
                          borderLeft: "1px solid var(--border)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CellCheck val={row[key]} />
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ padding: "40px 0 120px" }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="section-intro section-intro-center" style={{ marginBottom: 40 }}>
              <div className="eyebrow">FAQ</div>
              <h2 className="h-2 section-title">Pertanyaan yang sering ditanyakan</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map(([q, a], i) => (
                <div key={i} className="card" style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{q}</div>
                  <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
