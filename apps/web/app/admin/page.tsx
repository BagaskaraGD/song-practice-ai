"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import Background from "@/components/ui/Background";
import { api, ApiAdminStats, ApiAdminJob, ApiAdminRefund } from "@/lib/api";
import { Check, Activity, AlertTriangle, RefreshCw, Download, TrendingUp } from "lucide-react";

type AdminJobStatus = "done" | "running" | "failed";

function AdminStatCard({ label, value, delta, accent }: { label: string; value: string; delta: string; accent: "violet" | "pink" }) {
  const isPink = accent === "pink";
  const isPositive = delta.startsWith("+");
  return (
    <div className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute", top: -30, right: -20, width: 120, height: 120, borderRadius: 999,
          background: isPink
            ? "radial-gradient(circle, rgba(244,114,182,calc(.25 * var(--glow))), transparent 70%)"
            : "radial-gradient(circle, rgba(167,139,250,calc(.25 * var(--glow))), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</div>
      <div className="mono" style={{
        marginTop: 12, fontSize: 32, fontWeight: 700, letterSpacing: 0,
        color: isPink ? "var(--pink)" : "var(--violet)"
      }}>{value}</div>
      <div style={{
        marginTop: 6, fontSize: 12, display: "flex", alignItems: "center", gap: 4,
        color: isPositive ? "var(--success)" : "var(--danger)"
      }}>
        <TrendingUp size={12} /> {delta}
      </div>
    </div>
  );
}

function JobStatusBadge({ status }: { status: AdminJobStatus }) {
  if (status === "done") return <span className="badge badge-success"><Check size={11} /> Selesai</span>;
  if (status === "running") return <span className="badge badge-info"><Activity size={11} /> Jalan</span>;
  return <span className="badge badge-danger"><AlertTriangle size={11} /> Gagal</span>;
}

export default function AdminPage() {
  // Temporary: admin access is open in dev mode until real auth/roles are implemented.
  useProtectedRoute();
  const colTemplate = "1fr 1.4fr 1.4fr 0.6fr 1fr 0.8fr";

  const [stats, setStats] = useState<ApiAdminStats | null>(null);
  const [jobs, setJobs] = useState<ApiAdminJob[]>([]);
  const [refunds, setRefunds] = useState<ApiAdminRefund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("7 hari");

  const RANGES = ["24 jam", "7 hari", "30 hari", "90 hari"];
  const RANGE_KEYS: Record<string, string> = { "24 jam": "1d", "7 hari": "7d", "30 hari": "30d", "90 hari": "90d" };

  useEffect(() => {
    const rangeKey = RANGE_KEYS[range];
    async function load() {
      setLoading(true);
      try {
        const [s, j, r] = await Promise.all([
          api.getAdminStats(rangeKey),
          api.getAdminJobs(20),
          api.getAdminRefunds(),
        ]);
        setStats(s);
        setJobs(j);
        setRefunds(r);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal memuat data admin.");
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  async function handleApprove(jobId: string) {
    try {
      await api.approveRefund(jobId);
      setRefunds((prev) => prev.filter((r) => r.id !== jobId));
    } catch {
      alert("Gagal meng-approve refund.");
    }
  }

  async function handleRetry(jobId: string) {
    try {
      await api.retryJob(jobId);
      setRefunds((prev) => prev.filter((r) => r.id !== jobId));
    } catch {
      alert("Gagal melakukan retry.");
    }
  }

  const queue = stats?.queue;

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <Background
        orbs={[
          { size: 600, color: "#a78bfa", x: "80%", y: "0%", opacity: 0.35, blur: 140 },
          { size: 400, color: "#f472b6", x: "10%", y: "30%", opacity: 0.25, blur: 120 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar active="ringkasan" admin />

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
                <div className="eyebrow">Operasional</div>
                <h1 className="h-1 page-title">Ringkasan Operasional</h1>
                <p className="page-copy" style={{ fontSize: 13, color: "var(--text-3)" }}>
                  {loading ? "Memuat…" : "Diperbarui · data realtime dari API"}
                </p>
              </div>
              <div className="header-actions">
                <div style={{ display: "inline-flex", padding: 4, borderRadius: 999, background: "var(--card-strong)", border: "1px solid var(--border)" }}>
                  {RANGES.map((t) => (
                    <button key={t} onClick={() => setRange(t)} style={{
                      padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                      background: t === range ? "var(--grad-brand)" : "transparent",
                      color: t === range ? "#fff" : "var(--text-3)",
                      border: 0, cursor: "pointer"
                    }}>{t}</button>
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm"><Download size={13} /> Ekspor CSV</button>
              </div>
            </div>

            {/* KPI cards */}
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="card" style={{ padding: 22, minHeight: 100, opacity: 0.4 }} />
                  ))
                : stats?.kpis.map((kpi) => (
                    <AdminStatCard key={kpi.label} {...kpi} />
                  ))}
            </div>

            {/* Chart + Queue row */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
              {/* Chart area */}
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Pendapatan & Kredit Dipakai</div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-3)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--pink)" }} /> Pendapatan
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--violet)" }} /> Kredit
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 160 }}>
                  {[65,82,48,91,77,88,95].map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: "stretch" }}>
                      <div style={{
                        height: `${v * 0.65}%`, minHeight: 8, borderRadius: "4px 4px 0 0",
                        background: `linear-gradient(180deg, rgba(244,114,182,.8), rgba(244,114,182,.3))`
                      }} />
                      <div style={{
                        height: `${v * 0.4}%`, minHeight: 5, borderRadius: "4px 4px 0 0",
                        background: `linear-gradient(180deg, rgba(167,139,250,.8), rgba(167,139,250,.3))`
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((d) => (
                    <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--text-4)" }}>{d}</div>
                  ))}
                </div>
              </div>

              {/* Queue health */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Antrian Analisis</div>
                  <span className="pill pill-success" style={{ fontSize: 11 }}><span className="dot" /> NORMAL</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    ["Job berjalan", queue ? String(queue.running) : "…"],
                    ["Menunggu (queued)", queue ? String(queue.queued) : "…"],
                    ["Latency p95", queue?.latencyP95 ?? "…"],
                    ["Gagal (24 jam)", queue ? String(queue.failed24h) : "…"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}>{k}</span>
                      <span className="mono" style={{ fontSize: 15, fontWeight: 600, color: "var(--text-2)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, padding: "10px 14px", borderRadius: 10, background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)", fontSize: 12.5, color: "var(--success)" }}>
                  Kapasitas worker stabil
                </div>
              </div>
            </div>

            {/* Recent jobs */}
            <div className="card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Job Analisis Terakhir</div>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: colTemplate,
                padding: "12px 22px", fontSize: 11, color: "var(--text-3)",
                letterSpacing: ".06em", textTransform: "uppercase", borderBottom: "1px solid var(--border)"
              }}>
                <span>Job ID</span><span>Pengguna</span><span>Lagu</span><span>Kredit</span><span>Status</span><span>Latency</span>
              </div>
              {jobs.map((job, i) => (
                <div key={job.id} style={{
                  display: "grid", gridTemplateColumns: colTemplate, alignItems: "center",
                  padding: "14px 22px", fontSize: 13,
                  borderBottom: i < jobs.length - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <span className="mono" style={{ color: "var(--text-3)", fontSize: 12 }}>{job.id}</span>
                  <span style={{ color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.user}</span>
                  <span style={{ color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.song}</span>
                  <span className="mono" style={{ color: "var(--violet)" }}>{job.credits}k</span>
                  <span><JobStatusBadge status={job.status} /></span>
                  <span className="mono" style={{ color: "var(--text-3)", fontSize: 12 }}>{job.latency}</span>
                </div>
              ))}
              {!loading && jobs.length === 0 && (
                <div style={{ padding: "24px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>Belum ada job.</div>
              )}
            </div>

            {/* Refund queue */}
            <div className="card" style={{ marginTop: 24, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Antrian Refund · butuh review</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>
                    {refunds.length} pengguna menunggu pengembalian kredit
                  </div>
                </div>
              </div>
              {refunds.map((item, i) => (
                <div key={item.id} style={{
                  padding: "16px 22px", display: "flex", alignItems: "center", gap: 16,
                  borderBottom: i < refunds.length - 1 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span className="mono" style={{ fontSize: 12, color: "var(--text-4)" }}>{item.id}</span>
                      <span className="badge badge-danger" style={{ fontSize: 11 }}>{item.error}</span>
                    </div>
                    <div style={{ marginTop: 4, fontSize: 14, fontWeight: 500 }}>{item.song}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{item.user}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flex: "0 0 auto", flexWrap: "wrap" }}>
                    <button onClick={() => handleApprove(item.id)} className="btn btn-ghost btn-sm">Refund {item.credits}k</button>
                    <button onClick={() => handleRetry(item.id)} className="btn btn-ghost btn-sm"><RefreshCw size={12} /> Retry</button>
                    <button className="btn btn-ghost btn-sm">Lihat log</button>
                  </div>
                </div>
              ))}
              {!loading && refunds.length === 0 && (
                <div style={{ padding: "24px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>Tidak ada antrian refund.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
