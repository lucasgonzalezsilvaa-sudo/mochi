"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo iniciar sesión.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-line bg-cream p-8 shadow-[0_24px_60px_-40px_rgba(33,29,24,0.5)]">
          <p className="kicker text-terra">Los Viajes de Mochi</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">Panel de Mochi</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Ingresá tu contraseña para gestionar las notas.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="pw" className="mb-1.5 block text-sm font-medium text-ink">
                Contraseña
              </label>
              <input
                id="pw"
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-sand px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-terra focus:ring-2 focus:ring-terra/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-terra/10 px-4 py-2.5 text-sm text-terra-deep">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-full bg-terra px-5 py-3 text-white hover:bg-terra-deep disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-muted hover:text-terra"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
