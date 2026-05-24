"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/icons/Logo";
import Background from "@/components/ui/Background";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Mail, Lock, User, Loader, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { authed, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authed) router.replace("/dasbor");
  }, [authed, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Nama tidak boleh kosong."); return; }
    if (!email.trim()) { setError("Email tidak boleh kosong."); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter."); return; }

    setLoading(true);
    try {
      const { user: userData, accessToken } = await api.register({ name: name.trim(), email: email.trim(), password });
      login(accessToken, {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        initials: userData.initials,
        role: userData.role,
        plan: userData.plan,
        credits: userData.credits,
      });
      router.push("/dasbor");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan.";
      if (msg.includes("409") || msg.toLowerCase().includes("terdaftar")) {
        setError("Email sudah terdaftar. Coba masuk.");
      } else {
        setError(`Gagal mendaftar: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Background
        orbs={[
          { size: 700, color: "#f472b6", x: "80%", y: "20%", opacity: 0.45, blur: 130 },
          { size: 500, color: "#a78bfa", x: "15%", y: "70%", opacity: 0.4, blur: 110 },
        ]}
      />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={32} />
            <span style={{ fontSize: 19, fontWeight: 600, color: "var(--text)" }}>
              SongPractice <span style={{ color: "var(--violet)" }}>AI</span>
            </span>
          </Link>
          <p style={{ marginTop: 10, fontSize: 14, color: "var(--text-3)" }}>
            Buat akun gratis dan mulai analisis lagumu
          </p>
        </div>

        <div className="card" style={{ padding: "32px 28px" }}>
          <h1 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700 }}>Daftar Gratis</h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Nama</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
                <input
                  type="email"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-4)", pointerEvents: "none" }} />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 13, color: "var(--danger)", padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-md"
              style={{ marginTop: 4, justifyContent: "center", opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <><Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> Mendaftar…</>
                : <>Daftar Sekarang <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
            Sudah punya akun?{" "}
            <Link href="/masuk" style={{ color: "var(--violet)", textDecoration: "none" }}>
              Masuk
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-4)", textDecoration: "none" }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: var(--violet) !important; }
      `}</style>
    </div>
  );
}
