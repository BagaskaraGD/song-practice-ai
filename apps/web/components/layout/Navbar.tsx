"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/icons/Logo";
import { Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface NavbarProps {
  active?: string;
  admin?: boolean;
  credits?: number;
  userInitials?: string;
}

export default function Navbar({
  active = "beranda",
  admin = false,
  credits,
  userInitials,
}: NavbarProps) {
  const router = useRouter();
  const { authed, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const marketingLinks = [
    { id: "beranda", label: "Beranda", href: "/" },
    { id: "fitur", label: "Fitur", href: "/#fitur" },
    { id: "harga", label: "Harga", href: "/harga" },
    { id: "contoh", label: "Contoh Hasil", href: "/#contoh" },
    { id: "faq", label: "FAQ", href: "/#faq" },
  ];

  const authedLinks = [
    { id: "dasbor", label: "Dasbor", href: "/dasbor" },
    { id: "unggah", label: "Unggah", href: "/unggah" },
    { id: "riwayat", label: "Riwayat", href: "/dasbor" },
    { id: "bantuan", label: "Bantuan", href: "#" },
  ];

  const adminLinks = [
    { id: "ringkasan", label: "Ringkasan", href: "/admin" },
    { id: "pengguna", label: "Pengguna", href: "/admin" },
    { id: "antrian", label: "Antrian", href: "/admin" },
    { id: "pembayaran", label: "Pembayaran", href: "/admin" },
    { id: "laporan", label: "Laporan", href: "/admin" },
    { id: "pengaturan", label: "Pengaturan", href: "/admin" },
  ];

  function handleLogout() {
    logout();
    router.push("/");
  }

  const displayCredits = credits ?? user?.credits ?? 0;
  const displayInitials = userInitials ?? user?.initials ?? "?";

  return (
    <nav
      style={{
        position: "relative",
        zIndex: 10,
        padding: "24px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <Logo size={28} />
        <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: 0, color: "var(--text)" }}>
          SongPractice <span style={{ color: "var(--violet)" }}>AI</span>
        </span>
        {admin && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".1em",
              padding: "2px 7px",
              borderRadius: 4,
              background: "rgba(244,114,182,.15)",
              border: "1px solid rgba(244,114,182,.35)",
              color: "var(--pink)",
              textTransform: "uppercase",
              marginLeft: 4,
            }}
          >
            ADMIN
          </span>
        )}
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: admin ? 20 : 28, alignItems: "center" }}>
        {admin
          ? adminLinks.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                style={{
                  fontSize: 13,
                  color: l.id === active ? "var(--text)" : "var(--text-3)",
                  fontWeight: l.id === active ? 500 : 400,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))
          : (mounted && authed)
          ? authedLinks.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                style={{
                  fontSize: 14,
                  color: l.id === active ? "var(--text)" : "var(--text-3)",
                  fontWeight: l.id === active ? 500 : 400,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))
          : marketingLinks.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                style={{
                  fontSize: 14,
                  color: l.id === active ? "var(--text)" : "var(--text-3)",
                  fontWeight: l.id === active ? 500 : 400,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {admin ? (
          <>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>v0.1.0</span>
            <span className="pill pill-success" style={{ fontSize: 11 }}>
              <span className="dot" />
              Online
            </span>
          </>
        ) : (mounted && authed) ? (
          <>
            <span className="pill" style={{ gap: 5 }}>
              <Coins size={13} />
              <span className="mono" style={{ fontWeight: 600 }}>{displayCredits}</span>
              <span>kredit</span>
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "linear-gradient(135deg,#f472b6,#a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {displayInitials}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 4 }}
            >
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link href="/masuk" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link href="/daftar" className="btn btn-primary btn-sm">Mulai Gratis</Link>
          </>
        )}
      </div>
    </nav>
  );
}
