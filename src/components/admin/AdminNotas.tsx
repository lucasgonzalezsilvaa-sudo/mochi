"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";

type NotaMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover: string;
};

type TourOption = { slug: string; name: string };

const COVER_OPTIONS = [
  "/images/hero-atacama.jpg",
  "/images/colombia.jpg",
  "/images/patagonia.jpg",
  "/images/vertical-1.jpg",
  "/images/about-mochi.jpg",
  "/images/about-mochi-2.jpg",
];

const EMPTY = {
  originalSlug: "",
  title: "",
  slug: "",
  excerpt: "",
  date: new Date().toISOString().slice(0, 10),
  cover: COVER_OPTIONS[0],
  tags: "",
  author: "Mochi",
  tourSlug: "",
  content: "",
};

function slugifyClient(input: string) {
  return input
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminNotas() {
  const [notas, setNotas] = useState<NotaMeta[]>([]);
  const [tours, setTours] = useState<TourOption[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/notas");
    const data = await res.json();
    setNotas(data.notas ?? []);
  }, []);

  const loadTours = useCallback(async () => {
    const res = await fetch("/api/viajes");
    const data = await res.json();
    setTours((data.tours ?? []).map((t: { slug: string; name: string }) => ({ slug: t.slug, name: t.name })));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos al montar
    load();
    loadTours();
  }, [load, loadTours]);

  const isEditing = form.originalSlug !== "";

  function reset() {
    setForm({ ...EMPTY });
    setSlugTouched(false);
    setStatus(null);
  }

  function onTitle(value: string) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugifyClient(value),
    }));
  }

  async function edit(slug: string) {
    const res = await fetch(`/api/notas/${slug}`);
    if (!res.ok) return;
    const { nota } = await res.json();
    setForm({
      originalSlug: nota.slug,
      title: nota.title,
      slug: nota.slug,
      excerpt: nota.excerpt,
      date: nota.date,
      cover: nota.cover,
      tags: nota.tags.join(", "),
      author: nota.author,
      tourSlug: nota.tourSlug ?? "",
      content: nota.content,
    });
    setSlugTouched(true);
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(slug: string) {
    if (!confirm(`¿Borrar la nota "${slug}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/notas/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "ok", msg: "Nota borrada." });
      if (form.originalSlug === slug) reset();
      load();
    } else {
      setStatus({ type: "error", msg: "No se pudo borrar." });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "ok", msg: `Nota guardada: /notas/${data.slug}` });
        reset();
        load();
      } else {
        setStatus({ type: "error", msg: data.error ?? "Error al guardar." });
      }
    } catch {
      setStatus({ type: "error", msg: "Error de conexión." });
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-cream px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-terra focus:ring-2 focus:ring-terra/20";
  const label = "block text-sm font-medium text-ink mb-1.5";

  return (
    <div className="grid gap-8 px-5 py-8 lg:grid-cols-[1fr_320px]">
      {/* Formulario */}
      <form onSubmit={submit} className="rounded-2xl border border-line bg-sand-2/40 p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-ink">
            {isEditing ? "Editar nota" : "Nueva nota"}
          </h1>
          {isEditing && (
            <button
              type="button"
              onClick={reset}
              className="text-sm text-muted hover:text-terra"
            >
              + Crear nueva
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={label}>Título</label>
            <input
              className={field}
              value={form.title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="5 consejos para viajar por Uruguay"
              required
            />
          </div>

          <div>
            <label className={label}>
              Enlace (URL) <span className="text-muted">— /notas/{form.slug || "…"}</span>
            </label>
            <input
              className={field}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugifyClient(e.target.value) }));
              }}
              placeholder="consejos-viajar-uruguay"
            />
          </div>

          <div>
            <label className={label}>Resumen (aparece en las tarjetas y en Google)</label>
            <textarea
              className={`${field} h-20 resize-y`}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Una o dos frases que enganchen y describan la nota."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Fecha</label>
              <input
                type="date"
                className={field}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className={label}>Etiquetas (separadas por coma)</label>
              <input
                className={field}
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="uruguay, consejos"
              />
            </div>
          </div>

          <div>
            <label className={label}>
              Viaje relacionado{" "}
              <span className="text-muted">
                — opcional, el botón de la nota va a llevar a ese viaje
              </span>
            </label>
            <select
              className={field}
              value={form.tourSlug}
              onChange={(e) => setForm((f) => ({ ...f, tourSlug: e.target.value }))}
            >
              <option value="">Ninguno</option>
              {tours.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>
              Imagen de portada <span className="text-muted">— elegí una o subí la tuya</span>
            </label>
            <ImagePicker
              value={form.cover}
              onChange={(path) => setForm((f) => ({ ...f, cover: path }))}
              presets={COVER_OPTIONS}
            />
          </div>

          <div>
            <label className={label}>
              Contenido{" "}
              <span className="text-muted">
                — Markdown: ## Subtítulo, **negrita**, - listas, &gt; cita
              </span>
            </label>
            <textarea
              className={`${field} h-72 resize-y font-mono text-sm`}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder={"## Un subtítulo\n\nEscribí acá tu nota...\n\n- Punto uno\n- Punto dos"}
            />
          </div>
        </div>

        {status && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              status.type === "ok"
                ? "bg-ocean/10 text-ocean"
                : "bg-terra/10 text-terra-deep"
            }`}
          >
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn mt-5 w-full bg-terra px-5 py-3 text-white hover:bg-terra-deep disabled:opacity-60"
        >
          {loading ? "Guardando…" : isEditing ? "Guardar cambios" : "Publicar nota"}
        </button>
      </form>

      {/* Lista de notas */}
      <aside>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Notas publicadas
        </h2>
        <div className="space-y-2">
          {notas.length === 0 && (
            <p className="text-sm text-ink-soft">Todavía no hay notas.</p>
          )}
          {notas.map((n) => (
            <div
              key={n.slug}
              className="rounded-xl border border-line bg-cream p-3.5"
            >
              <p className="line-clamp-2 text-sm font-medium text-ink">{n.title}</p>
              <p className="mt-0.5 text-xs text-muted">{n.date}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <button onClick={() => edit(n.slug)} className="text-terra hover:underline">
                  Editar
                </button>
                <Link
                  href={`/notas/${n.slug}`}
                  target="_blank"
                  className="text-ink-soft hover:underline"
                >
                  Ver
                </Link>
                <button
                  onClick={() => remove(n.slug)}
                  className="text-muted hover:text-terra-deep hover:underline"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-line bg-sand-2/50 p-4 text-xs leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">Cómo funciona</p>
          <p className="mt-1.5">
            Cada nota se guarda como un archivo en tu proyecto. Escribís acá desde tu
            computadora y, para que aparezca online, subís los cambios a Git (Vercel
            republica solo). Así Google indexa cada nota para posicionarte.
          </p>
        </div>
      </aside>
    </div>
  );
}
