import Link from "next/link";
import Logo from "@/components/icons/Logo";
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "40px 0 36px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={22} />
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>© 2026 SongPractice AI · Dibuat di Indonesia</span>
        </div>
        <div style={{ display: "flex", gap: 22, fontSize: 13, color: "var(--text-3)", flexWrap: "wrap" }}>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privasi</Link>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Ketentuan</Link>
          <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Kontak</Link>
          <Link
            href="#"
            style={{ color: "inherit", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Globe size={14} /> Bahasa Indonesia
          </Link>
        </div>
      </div>
    </footer>
  );
}
