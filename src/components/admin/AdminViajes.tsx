"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ImagePicker from "@/components/admin/ImagePicker";

type TourMeta = {
  slug: string;
  name: string;
  place: string;
  dates: string;
  price: string;
};

type Review = { photo: string; name: string; opinion: string };

type Tour = {
  slug: string;
  name: string;
  place: string;
  dates: string;
  duration: string;
  image: string;
  blurb: string;
  intro: string[];
  highlights: string[];
  includes: string[];
  accent: "terra" | "ocean" | "sun";
  price: string;
  priceBefore?: string;
  offerEndsAt?: string;
  offerLabel?: string;
  reviews: Review[];
};

const EMPTY_REVIEW: Review = { photo: "", name: "", opinion: "" };

const COVER_OPTIONS = [
  "/images/hero-atacama.jpg",
  "/images/colombia.jpg",
  "/images/patagonia.jpg",
  "/images/vertical-1.jpg",
  "/images/about-mochi.jpg",
  "/images/about-mochi-2.jpg",
];

const ACCENT_OPTIONS = [
  { value: "terra", label: "Terra (naranja)" },
  { value: "ocean", label: "Ocean (azul)" },
  { value: "sun", label: "Sun (amarillo)" },
] as const;

const EMPTY = {
  originalSlug: "",
  name: "",
  slug: "",
  place: "",
  dates: "",
  duration: "",
  image: COVER_OPTIONS[0],
  blurb: "",
  intro: "",
  highlights: "",
  includes: "",
  accent: "terra" as Tour["accent"],
  price: "",
  priceBefore: "",
  offerEndsAt: "",
  offerLabel: "",
  reviews: [] as Review[],
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

export default function AdminViajes() {
  const [tours, setTours] = useState<TourMeta[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/viajes");
    const data = await res.json();
    setTours(data.tours ?? []);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos al montar
    load();
  }, [load]);

  const isEditing = form.originalSlug !== "";

  function reset() {
    setForm({ ...EMPTY });
    setSlugTouched(false);
    setStatus(null);
  }

  function onName(value: string) {
    setForm((f) => ({
      ...f,
      name: value,
      slug: slugTouched ? f.slug : slugifyClient(value),
    }));
  }

  async function edit(slug: string) {
    const res = await fetch(`/api/viajes/${slug}`);
    if (!res.ok) return;
    const { tour }: { tour: Tour } = await res.json();
    setForm({
      originalSlug: tour.slug,
      name: tour.name,
      slug: tour.slug,
      place: tour.place,
      dates: tour.dates,
      duration: tour.duration,
      image: tour.image,
      blurb: tour.blurb,
      intro: tour.intro.join("\n"),
      highlights: tour.highlights.join("\n"),
      includes: tour.includes.join("\n"),
      accent: tour.accent,
      price: tour.price,
      priceBefore: tour.priceBefore ?? "",
      offerEndsAt: tour.offerEndsAt ?? "",
      offerLabel: tour.offerLabel ?? "",
      reviews: tour.reviews ?? [],
    });
    setSlugTouched(true);
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(slug: string) {
    if (!confirm(`¿Borrar el viaje "${slug}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/viajes/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "ok", msg: "Viaje borrado." });
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
      const res = await fetch("/api/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "ok", msg: `Viaje guardado: /viajes/${data.slug}` });
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

  function addReview() {
    setForm((f) => ({ ...f, reviews: [...f.reviews, { ...EMPTY_REVIEW }] }));
  }

  function updateReview(index: number, patch: Partial<Review>) {
    setForm((f) => ({
      ...f,
      reviews: f.reviews.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }));
  }

  function removeReview(index: number) {
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, i) => i !== index) }));
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
            {isEditing ? "Editar viaje" : "Nuevo viaje"}
          </h1>
          {isEditing && (
            <button
              type="button"
              onClick={reset}
              className="text-sm text-muted hover:text-terra"
            >
              + Crear nuevo
            </button>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={label}>Nombre</label>
            <input
              className={field}
              value={form.name}
              onChange={(e) => onName(e.target.value)}
              placeholder="Atacama Infinito"
              required
            />
          </div>

          <div>
            <label className={label}>
              Enlace (URL) <span className="text-muted">— /viajes/{form.slug || "…"}</span>
            </label>
            <input
              className={field}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugifyClient(e.target.value) }));
              }}
              placeholder="atacama-infinito"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Lugar</label>
              <input
                className={field}
                value={form.place}
                onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
                placeholder="San Pedro de Atacama · Chile"
              />
            </div>
            <div>
              <label className={label}>Color de acento</label>
              <select
                className={field}
                value={form.accent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, accent: e.target.value as Tour["accent"] }))
                }
              >
                {ACCENT_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Fechas</label>
              <input
                className={field}
                value={form.dates}
                onChange={(e) => setForm((f) => ({ ...f, dates: e.target.value }))}
                placeholder="11 – 17 nov 2026"
              />
            </div>
            <div>
              <label className={label}>Duración</label>
              <input
                className={field}
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="7 días / 6 noches"
              />
            </div>
          </div>

          <div>
            <label className={label}>Descripción corta (tarjeta)</label>
            <textarea
              className={`${field} h-20 resize-y`}
              value={form.blurb}
              onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
              placeholder="Una o dos frases que enganchen y describan el viaje."
            />
          </div>

          <div className="rounded-xl border border-line bg-cream/50 p-4">
            <p className="mb-3 text-sm font-semibold text-ink">Precio y oferta</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Precio actual</label>
                <input
                  className={field}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="USD 950"
                  required
                />
              </div>
              <div>
                <label className={label}>
                  Precio anterior <span className="text-muted">— opcional, va tachado</span>
                </label>
                <input
                  className={field}
                  value={form.priceBefore}
                  onChange={(e) => setForm((f) => ({ ...f, priceBefore: e.target.value }))}
                  placeholder="USD 1.100"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={label}>
                Oferta vence <span className="text-muted">— opcional, muestra un contador</span>
              </label>
              <input
                type="datetime-local"
                className={field}
                value={form.offerEndsAt}
                onChange={(e) => setForm((f) => ({ ...f, offerEndsAt: e.target.value }))}
              />
            </div>
            <div className="mt-4">
              <label className={label}>
                Texto de oferta{" "}
                <span className="text-muted">— opcional, aparece al pie de la tarjeta</span>
              </label>
              <input
                className={field}
                value={form.offerLabel}
                onChange={(e) => setForm((f) => ({ ...f, offerLabel: e.target.value }))}
                placeholder="Precio especial por reserva anticipada"
              />
            </div>
          </div>

          <div>
            <label className={label}>
              Introducción <span className="text-muted">— un párrafo por línea</span>
            </label>
            <textarea
              className={`${field} h-24 resize-y`}
              value={form.intro}
              onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
              placeholder={"Primer párrafo del viaje...\nSegundo párrafo..."}
            />
          </div>

          <div>
            <label className={label}>
              Lo que van a vivir <span className="text-muted">— un ítem por línea</span>
            </label>
            <textarea
              className={`${field} h-24 resize-y`}
              value={form.highlights}
              onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
              placeholder={"Valle de la Luna al atardecer\nGéiseres del Tatio al amanecer"}
            />
          </div>

          <div>
            <label className={label}>
              Incluye <span className="text-muted">— un ítem por línea</span>
            </label>
            <textarea
              className={`${field} h-24 resize-y`}
              value={form.includes}
              onChange={(e) => setForm((f) => ({ ...f, includes: e.target.value }))}
              placeholder={"Alojamiento 6 noches\nTraslados y excursiones"}
            />
          </div>

          <div className="rounded-xl border border-line bg-cream/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">
                Reseñas <span className="text-muted">— opcional</span>
              </p>
              <button
                type="button"
                onClick={addReview}
                className="text-sm text-terra hover:underline"
              >
                + Agregar reseña
              </button>
            </div>

            {form.reviews.length === 0 && (
              <p className="mt-2 text-sm text-ink-soft">Todavía no hay reseñas para este viaje.</p>
            )}

            <div className="mt-3 space-y-4">
              {form.reviews.map((r, i) => (
                <div key={i} className="rounded-lg border border-line bg-sand/60 p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Reseña {i + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeReview(i)}
                      className="text-xs text-muted hover:text-terra-deep hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className={label}>Foto</label>
                      <ImagePicker
                        value={r.photo}
                        onChange={(path) => updateReview(i, { photo: path })}
                        presets={COVER_OPTIONS}
                        circular
                      />
                    </div>
                    <div>
                      <label className={label}>Nombre</label>
                      <input
                        className={field}
                        value={r.name}
                        onChange={(e) => updateReview(i, { name: e.target.value })}
                        placeholder="Camila R."
                      />
                    </div>
                    <div>
                      <label className={label}>Opinión</label>
                      <textarea
                        className={`${field} h-20 resize-y`}
                        value={r.opinion}
                        onChange={(e) => updateReview(i, { opinion: e.target.value })}
                        placeholder="Lo que dijo sobre el viaje..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={label}>
              Imagen principal <span className="text-muted">— elegí una o subí la tuya</span>
            </label>
            <ImagePicker
              value={form.image}
              onChange={(path) => setForm((f) => ({ ...f, image: path }))}
              presets={COVER_OPTIONS}
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
          {loading ? "Guardando…" : isEditing ? "Guardar cambios" : "Publicar viaje"}
        </button>
      </form>

      {/* Lista de viajes */}
      <aside>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Viajes publicados
        </h2>
        <div className="space-y-2">
          {tours.length === 0 && (
            <p className="text-sm text-ink-soft">Todavía no hay viajes.</p>
          )}
          {tours.map((t) => (
            <div
              key={t.slug}
              className="rounded-xl border border-line bg-cream p-3.5"
            >
              <p className="line-clamp-2 text-sm font-medium text-ink">{t.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                {t.place} · {t.price}
              </p>
              <div className="mt-2 flex gap-3 text-xs">
                <button onClick={() => edit(t.slug)} className="text-terra hover:underline">
                  Editar
                </button>
                <Link
                  href={`/viajes/${t.slug}`}
                  target="_blank"
                  className="text-ink-soft hover:underline"
                >
                  Ver
                </Link>
                <button
                  onClick={() => remove(t.slug)}
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
            Cada viaje se guarda en la base de datos (Supabase) y aparece online al
            instante, sin necesidad de volver a publicar.
          </p>
        </div>
      </aside>
    </div>
  );
}
