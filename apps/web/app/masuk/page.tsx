"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/icons/Logo";
import Background from "@/components/ui/Background";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Mail, Lock, Loader, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { authed, login } = useAuth();
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

    if (!email.trim()) { setError("Email tidak boleh kosong."); return; }
    if (!password.trim()) { setError("Password tidak boleh kosong."); return; }

    setLoading(true);
    try {
      const { user: userData, accessToken } = await api.login({ email: email.trim(), password });
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
      if (msg.includes("401") || msg.includes("salah")) {
        setError("Email atau password salah.");
      } else {
        setError(`Gagal masuk: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <Background
        orbs={[
          { size: 700, color: "#a78bfa", x: "20%", y: "30%", opacity: 0.5, blur: 130 },
          { size: 500, color: "#f472b6", x: "85%", y: "60%", opacity: 0.4, blur: 110 },
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
            Masuk untuk mulai analisis lagumu
          </p>
        </div>

        <div className="card" style={{ padding: "32px 28px" }}>
          <h1 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 700 }}>Masuk</h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  placeholder="Password kamu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                ? <><Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> Masuk…</>
                : <>Masuk <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)", fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
            Demo: <span style={{ color: "var(--text-2)" }}>raka@example.com</span> / <span style={{ color: "var(--text-2)" }}>password123</span>
          </div>

          <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--text-3)" }}>
            Belum punya akun?{" "}
            <Link href="/daftar" style={{ color: "var(--violet)", textDecoration: "none" }}>
              Daftar gratis
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
