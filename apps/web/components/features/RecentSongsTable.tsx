import { Check, AlertTriangle, ChevronRight, Search, Music } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

type SongStatus = "done" | "processing" | "failed";

interface Song {
  id: string;
  jobId: string | null;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  pkg: string;
  date: string;
  status: SongStatus;
}

function StatusBadge({ status }: { status: SongStatus }) {
  if (status === "done")
    return (
      <span className="badge badge-success">
        <Check size={11} /> Selesai
      </span>
    );
  if (status === "processing")
    return (
      <span className="badge badge-info">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="12" cy="12" r="9" strokeDasharray="40 60" strokeLinecap="round" />
        </svg>{" "}
        Memproses
      </span>
    );
  return (
    <span className="badge badge-danger">
      <AlertTriangle size={11} /> Gagal
    </span>
  );
}

interface RecentSongsTableProps {
  songs: Song[];
}

const RecentSongsTable: FC<RecentSongsTableProps> = ({ songs }) => {
  const colTemplate = "1.6fr .9fr .6fr 1fr 1fr .9fr .6fr";
  const accents = ["linear-gradient(135deg,#a78bfa,#ec4899)", "linear-gradient(135deg,#f472b6,#6366f1)"];

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Lagu Terakhir Dianalisis</div>
          <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>
            {songs.length} lagu · 30 hari terakhir
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              borderRadius: 9,
              background: "rgba(0,0,0,.25)",
              border: "1px solid var(--border)",
              fontSize: 13,
              color: "var(--text-3)",
              minWidth: 220,
            }}
          >
            <Search size={14} /> Cari judul atau artis...
          </div>
          <button className="btn btn-ghost btn-sm">Filter</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: colTemplate,
          padding: "12px 22px",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span>Lagu</span>
        <span>Kunci</span>
        <span>BPM</span>
        <span>Paket</span>
        <span>Status</span>
        <span>Tanggal</span>
        <span />
      </div>

      {songs.map((row, i) => (
        <div
          key={row.id}
          style={{
            display: "grid",
            gridTemplateColumns: colTemplate,
            alignItems: "center",
            padding: "14px 22px",
            borderBottom: i === songs.length - 1 ? "none" : "1px solid var(--border)",
            fontSize: 13.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 9,
                background: accents[i % 2],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                color: "#fff",
              }}
            >
              <Music size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{row.artist}</div>
            </div>
          </div>
          <span className="mono" style={{ color: "var(--text-2)" }}>{row.key}</span>
          <span className="mono" style={{ color: "var(--text-2)" }}>{row.bpm}</span>
          <span style={{ color: "var(--text-3)", fontSize: 13 }}>{row.pkg}</span>
          <span><StatusBadge status={row.status} /></span>
          <span className="mono" style={{ color: "var(--text-3)" }}>{row.date}</span>
          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
            {row.jobId && row.status === "done" ? (
              <Link href={`/analisis/${row.jobId}`} className="btn btn-ghost btn-sm" style={{ padding: "6px 8px" }}>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <button className="btn btn-ghost btn-sm" style={{ padding: "6px 8px" }} disabled={!row.jobId}>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      ))}

      <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <a style={{ fontSize: 13, color: "var(--text-3)", cursor: "pointer" }}>Lihat semua riwayat →</a>
      </div>
    </div>
  );
};

export default RecentSongsTable;
