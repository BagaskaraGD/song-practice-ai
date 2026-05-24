"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Background from "@/components/ui/Background";
import Waveform from "@/components/ui/Waveform";
import MetricCard from "@/components/features/MetricCard";
import ProcessingTimeline from "@/components/features/ProcessingTimeline";
import ChordSheet from "@/components/features/ChordSheet";
import NotAngkaCard from "@/components/features/NotAngkaCard";
import { api, ApiAnalysis, ApiJobProgress, ApiUser, ApiSong } from "@/lib/api";
import Capo from "@/components/icons/Capo";
import {
  Clock, Coins, Edit, Plus, Download, Play, Key, Activity, Star, AudioWaveform,
  RefreshCw, ChevronRight, Music2, AlertTriangle,
} from "lucide-react";

// ─── Adapters ─────────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  Intro: "rgba(167,139,250,.5)",
  "Verse 1": "rgba(244,114,182,.45)",
  "Verse 2": "rgba(244,114,182,.45)",
  Verse: "rgba(244,114,182,.45)",
  "Pre-Chorus": "rgba(244,114,182,.35)",
  Chorus: "rgba(99,102,241,.65)",
  Bridge: "rgba(167,139,250,.6)",
  Outro: "rgba(167,139,250,.35)",
};

const DEGREES = ["I", "V", "vi", "IV", "ii", "iii", "VII"];

function mapNotAngka(lines: ApiAnalysis["notAngka"]) {
  return lines.map((line) => ({
    label: line.label,
    notes: line.notes.map((n) => n.n),
    highlight: line.notes.reduce<number[]>((acc, n, i) => {
      if (n.highlight) acc.push(i);
      return acc;
    }, []),
    dim: line.notes.some((n) => n.dim),
  }));
}

function mapSteps(steps: ApiJobProgress["steps"]) {
  return steps.map((s) => ({
    title: s.label,
    desc: s.status === "done"
      ? `Selesai${s.durationMs ? ` · ${(s.durationMs / 1000).toFixed(1)}s` : ""}`
      : s.status === "running" ? "Sedang diproses..." : "Menunggu",
    status: (s.status === "running" ? "active" : s.status) as "done" | "active" | "pending",
    time: s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : "— —",
  }));
}

// ─── Processing view ──────────────────────────────────────────────────────────

interface ProcessingProps {
  progress: number;
  eta: number;
  steps: ApiJobProgress["steps"];
  jobId: string;
}

function ProcessingView({ progress, eta, steps, jobId }: ProcessingProps) {
  const mappedSteps = mapSteps(steps);
  const doneCount = steps.filter((s) => s.status === "done").length;

  return (
    <div style={{ position: "relative", padding: "40px 0 80px" }}>
      <div className="container-lg" style={{ maxWidth: 980 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)" }}>
          <Link href="/dasbor" style={{ color: "inherit", textDecoration: "none" }}>Dasbor</Link>
          <ChevronRight size={12} />
          <Link href="/unggah" style={{ color: "inherit", textDecoration: "none" }}>Unggah</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text-2)" }}>Menganalisis</span>
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ position: "relative", width: 240, height: 240, margin: "0 auto" }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: 999,
              background: "radial-gradient(circle, rgba(244,114,182,.5) 0%, transparent 70%)",
              filter: "blur(40px)", opacity: "calc(.9 * var(--glow))"
            }} />
            <div style={{
              position: "absolute", inset: 20, borderRadius: 999,
              background: "radial-gradient(circle, rgba(167,139,250,.6) 0%, rgba(167,139,250,.1) 60%, transparent 80%)",
              filter: "blur(20px)", opacity: "calc(.9 * var(--glow))"
            }} />
            <svg viewBox="0 0 240 240" style={{ position: "relative" }}>
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f472b6" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="6" />
              <circle cx="120" cy="120" r="100" fill="none" stroke="url(#ring-grad)" strokeWidth="6"
                strokeDasharray="628"
                strokeDashoffset={628 - (628 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 120 120)" />
              <g transform="translate(60, 110)">
                {Array.from({ length: 14 }).map((_, i) => {
                  const h = 12 + Math.abs(Math.sin(i * 0.9 + 1.7) * 20);
                  return <rect key={i} x={i * 9} y={-h / 2} width={5} height={h} rx={2.5} fill="url(#ring-grad)" />;
                })}
              </g>
              <text x="120" y="170" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" letterSpacing="2" fontFamily="var(--font-geist-mono)">
                {progress}% · {eta} DETIK
              </text>
            </svg>
          </div>

          <h1 className="h-2" style={{ marginTop: 28 }}>Lembar latihanmu sedang disiapkan.</h1>
          <p style={{ marginTop: 12, fontSize: 16, color: "var(--text-2)", maxWidth: 480, marginInline: "auto" }}>
            Santai dulu — analisis biasanya selesai dalam <b style={{ color: "var(--text)" }}>55 detik</b>.
            Halaman ini akan otomatis terbuka saat selesai.
          </p>

          <div style={{
            marginTop: 22, display: "inline-flex", alignItems: "center", gap: 14,
            padding: "8px 12px 8px 16px", borderRadius: 999, background: "var(--card-strong)", border: "1px solid var(--border)"
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#f472b6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Music2 size={16} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Job {jobId}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>Analisis sedang berjalan</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 40, padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <div>
              <div className="eyebrow">Timeline analisis</div>
              <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
                {doneCount} dari {steps.length} langkah · estimasi sisa <span className="mono" style={{ color: "var(--text-2)" }}>{eta} detik</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm">Lihat log</button>
              <button className="btn btn-ghost btn-sm">Batalkan</button>
            </div>
          </div>
          <ProcessingTimeline steps={mappedSteps} />
        </div>

        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Sambil menunggu</div>
            <h3 className="h-4" style={{ marginTop: 8 }}>Tahukah kamu?</h3>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>
              Capo memungkinkanmu memainkan akor sederhana (G, C, D, Em) tapi terdengar di kunci
              yang lebih tinggi. Cara cepat untuk main lagu sulit tanpa belajar barre chord.
            </p>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Notifikasi</div>
            <h3 className="h-4" style={{ marginTop: 8 }}>Tidak perlu menunggu di sini</h3>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>
              Kami akan kirim email saat lembar latihanmu siap. Atau tinggalkan halaman ini terbuka —
              hasilnya akan otomatis muncul.
            </p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
              <RefreshCw size={13} /> Kirimi email saat selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Failed view ──────────────────────────────────────────────────────────────

function FailedView({ jobId, error }: { jobId: string; error?: string }) {
  return (
    <div style={{ position: "relative", padding: "60px 0 80px" }}>
      <div className="container-lg" style={{ maxWidth: 600, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "var(--danger)" }}>
          <AlertTriangle size={28} />
        </div>
        <h1 className="h-2" style={{ marginTop: 24 }}>Analisis gagal</h1>
        <p style={{ marginTop: 12, fontSize: 15, color: "var(--text-2)", lineHeight: 1.6 }}>
          Job <span className="mono">{jobId}</span> tidak dapat diselesaikan.
          {error && <> Alasan: <span style={{ color: "var(--danger)" }}>{error}</span></>}
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/unggah" className="btn btn-primary btn-md">Coba lagi</Link>
          <Link href="/dasbor" className="btn btn-ghost btn-md">Kembali ke Dasbor</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Result view ──────────────────────────────────────────────────────────────

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPlayer({ streamUrl, songTitle }: { streamUrl: string | null; songTitle: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); } else { el.play(); }
  }, [playing]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Number(e.target.value);
  }, []);

  if (!streamUrl) {
    return (
      <div style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: 12, opacity: 0.4 }}>
        <button className="btn btn-ghost btn-sm" disabled style={{ width: 40, height: 40, padding: 0, borderRadius: 999 }}>
          <Play size={16} />
        </button>
        <span style={{ fontSize: 13, color: "var(--text-3)" }}>Audio tidak tersedia untuk lagu ini</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "4px 0" }}>
      <audio
        ref={audioRef}
        src={streamUrl}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        preload="metadata"
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={toggle}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 999, flex: "0 0 auto" }}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <Play size={16} />
          )}
        </button>
        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)", flex: "0 0 auto", minWidth: 38 }}>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.5}
          value={currentTime}
          onChange={seek}
          style={{
            flex: 1, height: 4, appearance: "none", background: "transparent", cursor: "pointer",
            accentColor: "var(--violet)",
          }}
        />
        <span className="mono" style={{ fontSize: 12, color: "var(--text-3)", flex: "0 0 auto", minWidth: 38 }}>
          {formatTime(duration)}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-3)", flex: "0 0 auto" }}>{songTitle}</span>
      </div>
    </div>
  );
}

interface ResultProps {
  analysis: ApiAnalysis;
  songTitle: string;
  songArtist: string;
  streamUrl: string | null;
}

function ResultView({ analysis: a, songTitle, songArtist, streamUrl }: ResultProps) {
  const [activeTab, setActiveTab] = useState(0);
  const easyKey = a.easyKey ?? a.key;
  const tabs = [`Akor Mudah · ${easyKey}`, `Akor Original · ${a.key}`, "Not Angka"];
  const notAngkaLines = mapNotAngka(a.notAngka);

  const structure = a.structure.map((s) => ({
    section: s.label,
    time: `${s.bars} bar`,
    color: SECTION_COLORS[s.label] ?? "rgba(167,139,250,.4)",
    prog: "—",
  }));

  const easyChords = a.easyChords.map((c, i) => ({
    chord: c.chord,
    degree: DEGREES[i] ?? "—",
  }));

  return (
    <div style={{ position: "relative", padding: "24px 0 80px" }}>
      <div className="container-lg">
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)" }}>
          <Link href="/dasbor" style={{ color: "inherit", textDecoration: "none" }}>Riwayat</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text-2)" }}>{songTitle} — {songArtist}</span>
        </div>

        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="badge badge-success" style={{ padding: "5px 12px" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#34d399", boxShadow: "0 0 8px #34d399" }} /> Selesai
              </span>
              <span className="pill"><Clock size={12} /> analisis selesai</span>
              <span className="pill"><Coins size={12} /> kredit terpakai</span>
            </div>
            <h1 className="h-1" style={{ marginTop: 18, marginBottom: 8 }}>{songTitle}</h1>
            <div style={{ fontSize: 16, color: "var(--text-2)" }}>{songArtist}</div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-md"><Edit size={14} /> Edit Hasil</button>
            <button className="btn btn-ghost btn-md"><Plus size={14} /> Analisis Lagu Lain</button>
            <button className="btn btn-primary btn-md"><Download size={14} /> Unduh PDF</button>
          </div>
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <MetricCard label="Kunci Terdeteksi" big={a.key} sub="Major" icon={<Key size={13} />} accent="pink" footnote="confidence tinggi" />
          <MetricCard label="Tempo" big={String(a.bpm)} sub={`BPM · ${a.timeSignature}`} icon={<Activity size={13} />} accent="violet" footnote="rentang stabil" />
          <MetricCard label="Kunci Mudah" big={easyKey} sub={a.capo ? `pakai Capo ${a.capo}` : "tanpa capo"} icon={<Star size={13} />} accent="pink" footnote="ramah pemula" />
          <MetricCard label="Skala" big={a.key} sub={`${a.key} Ionian`} icon={<AudioWaveform size={13} />} accent="violet" footnote="mayor diatonis" />
        </div>

        {/* Waveform player */}
        <div className="card" style={{ marginTop: 24, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Pemutar dengan struktur</div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>Dengarkan sambil baca chord sheet</div>
            </div>
          </div>
          <AudioPlayer streamUrl={streamUrl} songTitle={songTitle} />
          <div style={{ display: "flex", gap: 2, marginTop: 16, marginBottom: 8 }}>
            {structure.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 28, borderRadius: 6, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 500, padding: "0 4px", overflow: "hidden" }}>
                {s.section}
              </div>
            ))}
          </div>
          <div style={{ position: "relative", padding: "8px 0" }}>
            <Waveform width={1170} height={90} bars={140} seed={4.2} gap={3} id="result-wv" />
          </div>
        </div>

        {/* Main grid */}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Tab switch */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "inline-flex", padding: 4, borderRadius: 12, background: "var(--card-strong)", border: "1px solid var(--border)" }}>
                {tabs.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    style={{
                      padding: "8px 14px", borderRadius: 9,
                      background: i === activeTab ? "linear-gradient(135deg, rgba(244,114,182,.25), rgba(167,139,250,.18))" : "transparent",
                      color: i === activeTab ? "var(--text)" : "var(--text-3)",
                      border: i === activeTab ? "1px solid rgba(244,114,182,.35)" : "1px solid transparent",
                      fontSize: 13, fontWeight: 500, cursor: "pointer"
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>Transpose</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "5px 10px" }}>−</button>
                  <div className="mono" style={{ padding: "5px 12px", borderRadius: 8, background: "var(--card-strong)", border: "1px solid var(--border)", fontSize: 13, minWidth: 36, textAlign: "center" }}>0</div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "5px 10px" }}>+</button>
                </div>
              </div>
            </div>

            {/* Chord palette */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div className="eyebrow">Palet Akor (Versi Mudah)</div>
                  <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
                    {easyChords.length} akor utama{a.capo ? ` · pakai Capo ${a.capo} agar terdengar di kunci asli ${a.key}` : ""}
                  </div>
                </div>
                {a.capo != null && a.capo > 0 && (
                  <div style={{ padding: "10px 14px", borderRadius: 12, background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.3)", display: "flex", alignItems: "center", gap: 10 }}>
                    <Capo size={18} stroke="var(--violet)" />
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>Saran Capo</div>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 600, color: "var(--violet)" }}>Fret {a.capo}</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
                {easyChords.map(({ chord, degree }) => (
                  <div key={chord} style={{ textAlign: "center" }}>
                    <span className="chord chord-violet" style={{ height: 72, minWidth: 72, fontSize: 26 }}>{chord}</span>
                    <div className="mono" style={{ marginTop: 6, fontSize: 11, color: "var(--text-3)" }}>{degree}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chord sheet */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--violet)", boxShadow: "0 0 8px var(--violet)" }} />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Lembar Latihan</div>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>· 2 halaman A4</span>
                </div>
                <span className="pill" style={{ fontSize: 11 }}>Pratinjau PDF</span>
              </div>
              <ChordSheet />
            </div>

            {/* Not Angka */}
            {notAngkaLines.length > 0 && <NotAngkaCard lines={notAngkaLines} />}
          </div>

          {/* RIGHT sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Practice tips */}
            <div className="card card-glow" style={{
              padding: 22, position: "relative", overflow: "hidden",
              background: "linear-gradient(180deg, rgba(244,114,182,.10), rgba(167,139,250,.04))"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: "linear-gradient(135deg, rgba(244,114,182,.25), rgba(167,139,250,.1))",
                  border: "1px solid rgba(244,114,182,.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pink)"
                }}>
                  <span style={{ fontSize: 16 }}>💡</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Tips Latihan</div>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {(a.practiceTips as string[]).map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.5 }}>
                    <span className="mono" style={{ color: "var(--pink)", fontWeight: 600, flex: "0 0 auto" }}>0{i + 1}</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Structure */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="eyebrow">Struktur Lagu</div>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{structure.length} bagian</span>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {structure.map((s, i) => (
                  <div
                    key={i}
                    style={{ display: "grid", gridTemplateColumns: "12px 60px 1fr", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: "1px dashed var(--border)" }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.section}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{s.time}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--violet)" }}>{s.prog}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Disclaimer */}
            <div className="card" style={{
              padding: 18, display: "flex", gap: 12, alignItems: "flex-start",
              background: "rgba(251,191,36,.05)", border: "1px solid rgba(251,191,36,.18)"
            }}>
              <AlertTriangle size={18} color="var(--warning)" style={{ flex: "0 0 auto", marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Hasil AI mungkin perlu sedikit koreksi</div>
                <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4, lineHeight: 1.5 }}>
                  Lagu dengan banyak modulasi atau orkestrasi padat bisa salah deteksi 1–2 akor.
                  Pakai tombol Edit Hasil untuk memperbaiki.
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-primary btn-md" style={{ width: "100%" }}><Download size={14} /> Unduh PDF Lembar Latihan</button>
              <button className="btn btn-ghost btn-md" style={{ width: "100%" }}><Edit size={14} /> Edit Akor & Lirik</button>
              <button className="btn btn-ghost btn-md" style={{ width: "100%" }}><Plus size={14} /> Analisis Lagu Lain</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const POLL_MS = 2000;

export default function AnalysisPage() {
  useProtectedRoute();
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [user, setUser] = useState<ApiUser | null>(null);
  const [progress, setProgress] = useState<ApiJobProgress | null>(null);
  const [analysis, setAnalysis] = useState<ApiAnalysis | null>(null);
  const [song, setSong] = useState<ApiSong | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failError, setFailError] = useState<string | undefined>(undefined);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const songTitle = song?.title ?? "Lagu Anda";
  const songArtist = song?.artist ?? "—";

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const fetchAnalysis = useCallback(async () => {
    try {
      const a = await api.getAnalysisByJobId(jobId);
      setAnalysis(a);
      try {
        const s = await api.getSong(a.songId);
        setSong(s);
        // fetch presigned stream URL — non-fatal if storageKey absent (mock songs)
        api.getSongStreamUrl(a.songId)
          .then(({ url }) => setStreamUrl(url))
          .catch(() => null);
      } catch {
        // song fetch failure is non-fatal
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Gagal mengambil hasil analisis.");
    }
  }, [jobId]);

  useEffect(() => {
    api.getCurrentUser().then(setUser).catch(() => null);
  }, []);

  useEffect(() => {
    if (!jobId) return;

    async function poll() {
      try {
        const p = await api.getJobProgress(jobId);
        setProgress(p);

        if (p.status === "done") {
          stopPolling();
          await fetchAnalysis();
        } else if (p.status === "failed") {
          stopPolling();
          setFailError(p.error);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal memeriksa status job.");
        stopPolling();
      }
    }

    poll();
    pollingRef.current = setInterval(poll, POLL_MS);

    return () => stopPolling();
  }, [jobId, stopPolling, fetchAnalysis]);

  const status = progress?.status;
  const isProcessing = !status || status === "queued" || status === "running";
  const isFailed = status === "failed";
  const isDone = status === "done" && analysis != null;

  const orbsProcessing = [
    { size: 800, color: "#a78bfa", x: "50%", y: "40%", opacity: 0.45, blur: 140 },
    { size: 500, color: "#f472b6", x: "20%", y: "80%", opacity: 0.3, blur: 120 },
  ];
  const orbsResult = [
    { size: 700, color: "#a78bfa", x: "80%", y: "5%", opacity: 0.4, blur: 140 },
    { size: 500, color: "#f472b6", x: "10%", y: "20%", opacity: 0.35, blur: 120 },
  ];

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background orbs={isDone ? orbsResult : orbsProcessing} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="riwayat" credits={user?.credits ?? 0} userInitials={user?.initials ?? "?"} />

        {error && (
          <div style={{ margin: "24px auto", maxWidth: 800, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "var(--danger)", fontSize: 14 }}>
            Backend belum aktif atau terjadi kesalahan koneksi. <span style={{ opacity: .7 }}>{error}</span>
          </div>
        )}

        {isFailed && <FailedView jobId={jobId} error={failError} />}
        {isDone && <ResultView analysis={analysis} songTitle={songTitle} songArtist={songArtist} streamUrl={streamUrl} />}
        {isProcessing && !error && (
          <ProcessingView
            progress={progress?.progress ?? 0}
            eta={progress?.etaSeconds ?? 0}
            steps={progress?.steps ?? []}
            jobId={jobId}
          />
        )}
      </div>
    </div>
  );
}
