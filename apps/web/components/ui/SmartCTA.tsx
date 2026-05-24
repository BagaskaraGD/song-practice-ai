"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SmartCTA() {
  const { authed } = useAuth();
  const href = authed ? "/unggah" : "/masuk";

  return (
    <Link href={href} className="btn btn-primary btn-lg">
      <Sparkles size={18} /> Analisis Lagu Anda
    </Link>
  );
}
