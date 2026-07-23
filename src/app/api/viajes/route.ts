import { NextResponse } from "next/server";
import { getAllTours, saveTour, slugify, getTour, deleteTour } from "@/lib/viajes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La autenticación (sesión con cookie) la resuelve src/middleware.ts.

export async function GET() {
  const tours = getAllTours();
  return NextResponse.json({ tours });
}

function toLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value ?? "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const price = String(body.price ?? "").trim();
  if (!price) {
    return NextResponse.json({ error: "El precio es obligatorio" }, { status: 400 });
  }

  const originalSlug = body.originalSlug ? String(body.originalSlug) : "";
  const slug = slugify(String(body.slug ?? name));
  if (!slug) {
    return NextResponse.json({ error: "No se pudo generar el enlace (slug)" }, { status: 400 });
  }

  // Evita pisar otro viaje existente al crear uno nuevo.
  if (slug !== originalSlug && getTour(slug)) {
    return NextResponse.json(
      { error: `Ya existe un viaje con el enlace "${slug}". Cambiá el nombre.` },
      { status: 409 },
    );
  }

  const accent = ["terra", "ocean", "sun"].includes(String(body.accent))
    ? (String(body.accent) as "terra" | "ocean" | "sun")
    : "terra";

  try {
    saveTour({
      slug,
      name,
      place: String(body.place ?? "").trim(),
      dates: String(body.dates ?? "").trim(),
      duration: String(body.duration ?? "").trim(),
      image: String(body.image ?? "/images/hero-atacama.jpg"),
      blurb: String(body.blurb ?? "").trim(),
      intro: toLines(body.intro),
      highlights: toLines(body.highlights),
      includes: toLines(body.includes),
      accent,
      price,
      priceBefore: String(body.priceBefore ?? "").trim() || undefined,
      offerEndsAt: String(body.offerEndsAt ?? "").trim() || undefined,
      offerLabel: String(body.offerLabel ?? "").trim() || undefined,
      reviews: Array.isArray(body.reviews)
        ? body.reviews.map((r: Record<string, unknown>) => ({
            photo: String(r?.photo ?? "").trim(),
            name: String(r?.name ?? "").trim(),
            opinion: String(r?.opinion ?? "").trim(),
          }))
        : [],
    });

    // Si se editó el slug, borra el archivo viejo.
    if (originalSlug && originalSlug !== slug) {
      deleteTour(originalSlug);
    }
  } catch (e) {
    return NextResponse.json(
      {
        error:
          "No se pudo guardar. En un servidor sin escritura (como Vercel) el admin funciona solo en tu computadora local.",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, slug });
}
