"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Background from "@/components/ui/Background";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Orb from "@/components/ui/Orb";
import StatCard from "@/components/features/StatCard";
import RecentSongsTable from "@/components/features/RecentSongsTable";
import { api, ApiUser, ApiSong } from "@/lib/api";
import { Coins, Music2, FileText, Upload, Lightbulb, Folder } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"][d.getMonth()]}`;
}

const PKG_LABEL: Record<string, string> = {
  easy: "Akor Mudah",
  original: "Original",
  full: "Lengkap",
  full_tips: "Lengkap + Tips",
};

function mapSongForTable(s: ApiSong) {
  const job = s.jobs?.[0] ?? null;
  const status = job?.status === "done" ? "done"
    : job?.status === "failed" ? "failed"
    : job ? "processing"
    : "done";
  return {
    id: s.id,
    jobId: job?.id ?? null,
    title: s.title,
    artist: s.artist,
    key: job?.analysis?.key ?? "—",
    bpm: job?.analysis?.bpm ?? 0,
    pkg: job ? (PKG_LABEL[job.pkg] ?? job.pkg) : "—",
    date: formatDate(s.createdAt),
    status: status as "done" | "processing" | "failed",
  };
}

export default function DashboardPage() {
  useProtectedRoute();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [songs, setSongs] = useState<ApiSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const heatmapColors = ["rgba(255,255,255,.04)", "rgba(167,139,250,.2)", "rgba(167,139,250,.5)", "rgba(244,114,182,.6)"];

  useEffect(() => {
    async function load() {
      try {
        const [u, s] = await Promise.all([api.getCurrentUser(), api.getSongs()]);
        setUser(u);
        setSongs(s);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const credits = user?.credits ?? 0;
  const totalCredits = user?.totalCredits ?? 60;
  const name = user?.name ?? "—";
  const initials = user?.initials ?? "?";
  const plan = user?.plan ?? "—";

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background
        orbs={[
          { size: 600, color: "#a78bfa", x: "80%", y: "0%", opacity: 0.4, blur: 130 },
          { size: 400, color: "#f472b6", x: "20%", y: "0%", opacity: 0.3, blur: 100 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="dasbor" credits={credits} userInitials={initials} />

        <div style={{ position: "relative", padding: "30px 0 60px" }}>
          <div className="container-lg">

            {error && (
              <div style={{ marginBottom: 24, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "var(--danger)", fontSize: 14 }}>
                Backend belum aktif atau terjadi kesalahan koneksi. <span style={{ opacity: .7 }}>{error}</span>
              </div>
            )}

            {/* Header */}
            <div className="page-header-row">
              <div className="page-intro">
                <div className="eyebrow">Selamat datang kembali</div>
                <h1 className="h-1 page-title">
                  {loading ? "Memuat…" : `Halo, ${name} 👋`}
                </h1>
                <p className="page-copy">
                  Sudah <b style={{ color: "var(--text)" }}>{songs.length} lagu</b> dianalisis. Ayo coba lagu berikutnya.
                </p>
              </div>
              <div className="header-actions">
                <button className="btn btn-ghost btn-md"><Folder size={14} /> Lihat Riwayat</button>
                <Link href="/unggah" className="btn btn-primary btn-md"><Upload size={14} /> Unggah Lagu Baru</Link>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 16 }}>
              {/* Credit balance */}
              <div className="card card-glow" style={{
                padding: 28, position: "relative", overflow: "hidden",
                background: "linear-gradient(135deg, rgba(244,114,182,.12), rgba(167,139,250,.06))"
              }}>
                <div style={{ position: "absolute", right: -40, top: -40 }}>
                  <Orb size={260} color="#f472b6" x="0%" y="0%" opacity={0.6} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Coins size={14} /> Saldo Kredit
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 14 }}>
                      <span className="mono" style={{
                        fontSize: 56, fontWeight: 700, letterSpacing: 0,
                        background: "var(--grad-brand)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
                      }}>{loading ? "…" : credits}</span>
                      <span style={{ fontSize: 14, color: "var(--text-3)" }}>/ {totalCredits} kredit bulanan</span>
                    </div>
                  </div>
                  <span className="pill pill-pink"><span className="dot" /> {plan}</span>
                </div>
                <div style={{ marginTop: 18, height: 8, borderRadius: 999, background: "rgba(255,255,255,.05)", overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${totalCredits > 0 ? (credits / totalCredits) * 100 : 0}%`, height: "100%", background: "var(--grad-brand)" }} />
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-3)" }}>
                  <span>Reset hari ke-<b style={{ color: "var(--text-2)" }}>{user?.resetDay ?? "—"}</b></span>
                  <a style={{ color: "var(--violet)", cursor: "pointer" }}>Beli kredit tambahan →</a>
                </div>
              </div>

              <StatCard label="Lagu Dianalisis" big={String(songs.length)} sub={`total`} icon={<Music2 size={13} />} accent="violet" />
              <StatCard label="PDF Dibuat" big="—" sub="fitur segera hadir" icon={<FileText size={13} />} accent="pink" />
              <StatCard label="Kredit Terpakai" big={String(totalCredits - credits)} sub="dari total" icon={<Coins size={13} />} accent="violet" />
            </div>

            {/* Main grid */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
              {loading ? (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
                  Memuat data lagu…
                </div>
              ) : (
                <RecentSongsTable songs={songs.map(mapSongForTable)} />
              )}

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Quick upload */}
                <div className="card card-glow" style={{
                  padding: 24, position: "relative", overflow: "hidden",
                  background: "linear-gradient(180deg, rgba(167,139,250,.10), rgba(244,114,182,.04))"
                }}>
                  <Orb size={300} color="#a78bfa" x="100%" y="100%" opacity={0.5} />
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f472b6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Upload size={20} />
                    </div>
                    <h3 className="h-4" style={{ marginTop: 14, marginBottom: 6 }}>Mulai lagu baru</h3>
                    <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0, lineHeight: 1.5 }}>
                      Tarik file MP3/WAV ke sini, atau pilih dari penyimpananmu.
                    </p>
                    <Link href="/unggah" className="btn btn-primary btn-md" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
                      Unggah Lagu Baru
                    </Link>
                  </div>
                </div>

                {/* Tip */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Lightbulb size={16} color="var(--warning)" />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Tip Mingguan</div>
                  </div>
                  <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>
                    Untuk akurasi terbaik, unggah file <span className="mono" style={{ color: "var(--text)" }}>WAV</span> atau MP3 320 kbps.
                    Live recording dengan derau tinggi bisa menurunkan deteksi kunci.
                  </p>
                </div>

                {/* Storage */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Penyimpanan</div>
                    <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{songs.length} file</span>
                  </div>
                  <div style={{ marginTop: 14, height: 6, borderRadius: 999, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((songs.length / 50) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#a78bfa,#6366f1)" }} />
                  </div>
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-3)" }}>
                    <span>{songs.length} file audio</span>
                    <a style={{ color: "var(--violet)", cursor: "pointer" }}>Kelola →</a>
                  </div>
                </div>

                {/* Activity heatmap */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Aktivitas 8 minggu</div>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{songs.length} lagu</span>
                  </div>
                  <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
                    {Array.from({ length: 56 }).map((_, i) => {
                      const r = (Math.sin(i * 12.9) + 1) / 2;
                      const lvl = Math.floor(r * 4);
                      return (
                        <div key={i} style={{ aspectRatio: "1", borderRadius: 3, background: heatmapColors[lvl] }} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
