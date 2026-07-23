"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminNotas from "@/components/admin/AdminNotas";
import AdminViajes from "@/components/admin/AdminViajes";

const TABS = [
  { id: "notas", label: "Notas" },
  { id: "viajes", label: "Viajes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("notas");

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Barra superior */}
      <div className="sticky top-0 z-10 border-b border-line bg-sand/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg text-ink">Panel de Mochi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ink-soft hover:text-terra">
              Ver el sitio →
            </Link>
            <button
              onClick={logout}
              className="text-sm text-muted hover:text-terra-deep"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-terra text-terra-deep"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        {tab === "notas" ? <AdminNotas /> : <AdminViajes />}
      </div>
    </div>
  );
}
