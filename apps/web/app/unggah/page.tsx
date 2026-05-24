"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Background from "@/components/ui/Background";
import Waveform from "@/components/ui/Waveform";
import PackageOption from "@/components/features/PackageOption";
import { api, putToStorage, ApiUser } from "@/lib/api";
import { Upload, Check, AlertTriangle, Lightbulb, Sparkles, Coins, ChevronRight, Loader, X } from "lucide-react";

const packages = [
  { id: "easy", label: "Akor Mudah", credits: 1, desc: "Kunci, BPM, dan akor versi ramah pemula.", items: ["Kunci & BPM", "Akor mudah"] },
  { id: "original", label: "Original + Akor Mudah", credits: 2, desc: "Plus akor di kunci asli, dengan saran capo otomatis.", items: ["Kunci & BPM", "Akor original", "Akor mudah", "Saran capo"] },
  { id: "full", label: "Lembar Latihan Lengkap", credits: 4, desc: "Plus Not Angka, struktur lagu, dan PDF siap cetak.", items: ["Akor original + mudah", "Saran capo", "Not Angka melodi", "Struktur lagu (Intro/Verse/Chorus)", "PDF lembar latihan"] },
  { id: "full_tips", label: "Lengkap + Tips AI", credits: 5, desc: "Semua di atas, plus tips latihan spesifik dari AI.", items: ["Semua fitur Lengkap", "Tips latihan kustom", "Saran fingering & dinamika"] },
];

const ALLOWED_MIME = new Set([
  "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a",
  "audio/wav", "audio/wave", "audio/x-wav",
  "audio/ogg", "audio/flac", "audio/x-flac", "audio/aac", "audio/webm",
]);
const MAX_BYTES = 50 * 1024 * 1024;

function formatFileSize(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function detectDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const dur = audio.duration;
      resolve(isFinite(dur) && dur > 0 ? Math.round(dur) : null);
    };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    audio.src = url;
  });
}

export default function UploadPage() {
  useProtectedRoute();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [selectedPkg, setSelectedPkg] = useState("full");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [phase, setPhase] = useState<"idle" | "uploading" | "queuing">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selected = packages.find((p) => p.id === selectedPkg)!;
  const credits = user?.credits ?? 0;
  const balanceAfter = credits - selected.credits;

  useEffect(() => {
    api.getCurrentUser().then(setUser).catch(() => null);
  }, []);

  const validateAndSet = useCallback(async (f: File) => {
    setFileError(null);
    if (!ALLOWED_MIME.has(f.type)) {
      setFileError(`Format tidak didukung (${f.type || "tidak dikenal"}). Gunakan MP3, WAV, M4A, OGG, atau FLAC.`);
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError(`File terlalu besar (${formatFileSize(f.size)}). Maks 50 MB.`);
      return;
    }
    setFile(f);
    const dur = await detectDuration(f);
    setFileDuration(dur);
  }, []);

  const handleFilePick = useCallback((files: FileList | null) => {
    if (files && files.length > 0) validateAndSet(files[0]);
  }, [validateAndSet]);

  useEffect(() => {
    const zone = dropRef.current;
    if (!zone) return;
    const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFilePick(e.dataTransfer?.files ?? null);
    };
    zone.addEventListener("dragover", onDragOver);
    zone.addEventListener("dragleave", onDragLeave);
    zone.addEventListener("drop", onDrop);
    return () => {
      zone.removeEventListener("dragover", onDragOver);
      zone.removeEventListener("dragleave", onDragLeave);
      zone.removeEventListener("drop", onDrop);
    };
  }, [handleFilePick]);

  async function handleAnalysis() {
    if (!file) return;
    setSubmitError(null);
    setPhase("uploading");
    setUploadPct(0);

    try {
      const { uploadId, uploadUrl } = await api.initUpload({
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
        durationSeconds: fileDuration ?? undefined,
        pkg: selectedPkg,
      });

      await putToStorage(uploadUrl, file, (pct) => setUploadPct(pct));

      setPhase("queuing");
      const { jobId } = await api.completeUpload(uploadId);
      router.push(`/analisis/${jobId}`);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Gagal memulai analisis.");
      setPhase("idle");
      setUploadPct(0);
    }
  }

  const submitting = phase !== "idle";

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background
        orbs={[
          { size: 600, color: "#a78bfa", x: "50%", y: "10%", opacity: 0.45, blur: 130 },
          { size: 400, color: "#f472b6", x: "80%", y: "40%", opacity: 0.3, blur: 100 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="unggah" credits={credits} userInitials={user?.initials ?? "?"} />

        <div style={{ position: "relative", padding: "30px 0 80px" }}>
          <div className="container-lg" style={{ maxWidth: 1100 }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)" }}>
              <Link href="/dasbor" style={{ color: "inherit", textDecoration: "none" }}>Dasbor</Link>
              <ChevronRight size={12} />
              <span style={{ color: "var(--text-2)" }}>Unggah Lagu Baru</span>
            </div>

            <div className="page-intro" style={{ marginTop: 20 }}>
              <h1 className="h-1 page-title">Unggah lagu</h1>
              <p className="page-copy">
                Tarik file audio ke kotak di bawah, lalu pilih kedalaman analisis yang kamu butuhkan.
              </p>
            </div>

            {(submitError || fileError) && (
              <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "var(--danger)", fontSize: 14 }}>
                {submitError ?? fileError}
              </div>
            )}

            <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Dropzone */}
                <div className="card card-glow" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFilePick(e.target.files)}
                  />

                  <div
                    ref={dropRef}
                    onClick={() => !file && fileInputRef.current?.click()}
                    style={{
                      borderRadius: 20, padding: 36,
                      border: `2px dashed ${dragging ? "rgba(167,139,250,.9)" : "rgba(167,139,250,.5)"}`,
                      background: dragging
                        ? "rgba(167,139,250,.08)"
                        : "linear-gradient(180deg, rgba(167,139,250,.06), rgba(244,114,182,.03))",
                      position: "relative", overflow: "hidden",
                      cursor: file ? "default" : "pointer",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, opacity: 0.2, pointerEvents: "none", display: "flex", alignItems: "center" }}>
                      <Waveform width={900} height={120} bars={90} seed={5.4} gap={4} id="upload-wv" />
                    </div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24 }}>
                      <div style={{
                        width: 80, height: 80, borderRadius: 20, flex: "0 0 auto",
                        background: "linear-gradient(135deg, rgba(244,114,182,.25), rgba(167,139,250,.18))",
                        border: "1px solid var(--border-strong)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--pink)",
                        boxShadow: "0 0 40px rgba(244,114,182, calc(.4 * var(--glow)))"
                      }}>
                        <Upload size={32} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 600 }}>
                          {dragging ? "Lepaskan file di sini" : "Tarik file audio ke sini"}
                        </div>
                        <div style={{ fontSize: 14, color: "var(--text-3)", marginTop: 6, lineHeight: 1.5 }}>
                          atau{" "}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            style={{ background: "none", border: "none", padding: 0, color: "var(--violet)", textDecoration: "underline", cursor: "pointer", font: "inherit" }}
                          >
                            pilih dari komputermu
                          </button>
                          . Maks 50 MB / 8 menit per lagu.
                        </div>
                        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {["MP3", "WAV", "M4A", "OGG", "FLAC"].map((ext) => (
                            <span key={ext} className="mono" style={{
                              padding: "4px 9px", borderRadius: 6,
                              background: "rgba(0,0,0,.3)", border: "1px solid var(--border)",
                              fontSize: 11, color: "var(--text-2)", letterSpacing: ".04em"
                            }}>{ext}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected file row */}
                  {file && (
                    <div style={{
                      marginTop: 18, padding: 14, borderRadius: 14,
                      background: phase === "uploading" ? "rgba(167,139,250,.06)" : "rgba(52,211,153,.06)",
                      border: `1px solid ${phase === "uploading" ? "rgba(167,139,250,.3)" : "rgba(52,211,153,.25)"}`,
                      display: "flex", alignItems: "center", gap: 14,
                      transition: "background .2s, border-color .2s",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 9, flex: "0 0 auto",
                        background: phase === "uploading"
                          ? "linear-gradient(135deg,rgba(167,139,250,.4),rgba(244,114,182,.3))"
                          : "linear-gradient(135deg,#34d399,#22d3ee)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                      }}>
                        {phase === "uploading" ? <Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 500, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>{file.name}</span>
                          {fileDuration && (
                            <span className="pill" style={{ padding: "3px 9px", fontSize: 11 }}>
                              <span className="mono">{formatDuration(fileDuration)}</span>
                            </span>
                          )}
                          <span className="pill" style={{ padding: "3px 9px", fontSize: 11 }}>
                            <span className="mono">{formatFileSize(file.size)}</span>
                          </span>
                        </div>
                        <div style={{ marginTop: 8, height: 4, borderRadius: 4, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
                          <div style={{
                            width: phase === "idle" ? "100%" : `${uploadPct}%`,
                            height: "100%",
                            background: phase === "uploading"
                              ? "linear-gradient(90deg,#a78bfa,#f472b6)"
                              : "linear-gradient(90deg,#34d399,#22d3ee)",
                            transition: "width .2s",
                          }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-3)" }}>
                          <span>
                            {phase === "idle" && "Siap diunggah"}
                            {phase === "uploading" && `Mengunggah… ${uploadPct}%`}
                            {phase === "queuing" && "Menjadwalkan analisis…"}
                          </span>
                          <span className="mono">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      {phase === "idle" && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: "6px 8px" }}
                          onClick={() => { setFile(null); setFileDuration(null); setFileError(null); }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Package selector */}
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Pilih paket analisis</div>
                      <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 4 }}>Bisa diubah sebelum mulai. Setiap paket memakai jumlah kredit berbeda.</div>
                    </div>
                    <span className="pill" style={{ gap: 5 }}>
                      <Coins size={12} /> <span className="mono">{credits}</span> kredit tersisa
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {packages.map((pkg) => (
                      <PackageOption
                        key={pkg.id}
                        {...pkg}
                        selected={selectedPkg === pkg.id}
                        onSelect={() => setSelectedPkg(pkg.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* AI Warning */}
                <div className="card" style={{
                  padding: 18, display: "flex", gap: 12, alignItems: "flex-start",
                  background: "rgba(251,191,36,.05)", border: "1px solid rgba(251,191,36,.18)"
                }}>
                  <AlertTriangle size={18} color="var(--warning)" style={{ flex: "0 0 auto", marginTop: 2 }} />
                  <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>
                    <b style={{ color: "var(--text)" }}>Hasil AI mungkin perlu sedikit koreksi.</b>{" "}
                    Lagu dengan banyak modulasi, orkestrasi padat, atau rekaman live yang berisik
                    bisa salah deteksi 1–2 akor. Kamu bisa edit hasil kapan saja.
                  </div>
                </div>
              </div>

              {/* RIGHT — summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="card card-glow" style={{
                  padding: 24, position: "relative", overflow: "hidden",
                  background: "linear-gradient(180deg, rgba(244,114,182,.10), rgba(167,139,250,.04))"
                }}>
                  <div className="eyebrow">Ringkasan</div>
                  <h3 className="h-4" style={{ marginTop: 12 }}>{selected.label}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-3)" }}>
                    untuk <span style={{ color: "var(--text-2)" }}>{file ? file.name : "—"}</span>
                  </p>

                  <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
                    {[
                      ["Durasi lagu", file && fileDuration ? formatDuration(fileDuration) : "—"],
                      ["Ukuran file", file ? formatFileSize(file.size) : "—"],
                      ["Estimasi waktu analisis", "~ 55 detik"],
                      ["Paket", selected.label],
                      ["Bahasa Not Angka", "Indonesia"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-3)" }}>{k}</span>
                        <span style={{ color: "var(--text)" }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-3)", fontSize: 14 }}>Biaya analisis</span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span className="mono" style={{
                        fontSize: 36, fontWeight: 700, letterSpacing: 0,
                        background: "var(--grad-brand)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
                      }}>{selected.credits}</span>
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}>kredit</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 4, textAlign: "right", fontSize: 12, color: "var(--text-3)" }}>
                    Saldo setelah analisis:{" "}
                    <span className="mono" style={{ color: balanceAfter < 0 ? "var(--danger)" : "var(--text-2)" }}>
                      {balanceAfter} kredit
                    </span>
                  </div>

                  {balanceAfter < 0 && (
                    <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", fontSize: 12.5, color: "var(--danger)" }}>
                      Kredit tidak cukup.{" "}
                      <Link href="/harga" style={{ color: "inherit", textDecoration: "underline" }}>Beli kredit</Link>
                    </div>
                  )}

                  <button
                    onClick={handleAnalysis}
                    disabled={submitting || !file || balanceAfter < 0}
                    className="btn btn-primary btn-lg"
                    style={{ marginTop: 20, width: "100%", justifyContent: "center", opacity: (submitting || !file || balanceAfter < 0) ? 0.6 : 1 }}
                  >
                    {submitting ? <><Loader size={16} /> {phase === "uploading" ? `Mengunggah ${uploadPct}%…` : "Menjadwalkan…"}</> : <><Sparkles size={16} /> Mulai Analisis</>}
                  </button>
                  <p style={{ margin: "10px 0 0", fontSize: 11.5, color: "var(--text-4)", textAlign: "center", lineHeight: 1.5 }}>
                    Dengan menekan tombol, kamu setuju lagu disimpan max 30 hari untuk re-analisis gratis.
                  </p>
                </div>

                {/* Tips */}
                <div className="card" style={{ padding: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                    <Lightbulb size={16} color="var(--warning)" /> Untuk hasil terbaik
                  </div>
                  <ul style={{ margin: "12px 0 0", padding: "0 0 0 18px", color: "var(--text-2)", fontSize: 13, lineHeight: 1.7 }}>
                    <li>Gunakan audio versi studio, bukan cover live.</li>
                    <li>MP3 minimal 192 kbps atau WAV.</li>
                    <li>Hindari file dengan suara penonton/derau.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
