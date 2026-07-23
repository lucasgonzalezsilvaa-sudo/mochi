import { NextResponse } from "next/server";
import { getAllNotas, saveNota, slugify, getNota } from "@/lib/notas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La autenticación (sesión con cookie) la resuelve src/middleware.ts.

export async function GET() {
  const notas = getAllNotas().map((n) => ({
    slug: n.slug,
    title: n.title,
    date: n.date,
    excerpt: n.excerpt,
    tags: n.tags,
    cover: n.cover,
  }));
  return NextResponse.json({ notas });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "");
  if (!title) {
    return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  }

  const originalSlug = body.originalSlug ? String(body.originalSlug) : "";
  const slug = slugify(String(body.slug ?? title));
  if (!slug) {
    return NextResponse.json({ error: "No se pudo generar el enlace (slug)" }, { status: 400 });
  }

  // Evita pisar otra nota existente al crear una nueva.
  if (slug !== originalSlug && getNota(slug)) {
    return NextResponse.json(
      { error: `Ya existe una nota con el enlace "${slug}". Cambiá el título.` },
      { status: 409 },
    );
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t) => String(t).trim()).filter(Boolean)
    : String(body.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  try {
    saveNota({
      slug,
      title,
      excerpt: String(body.excerpt ?? "").trim(),
      date: String(body.date ?? new Date().toISOString().slice(0, 10)),
      cover: String(body.cover ?? "/images/hero-atacama.jpg"),
      tags,
      author: String(body.author ?? "Mochi"),
      tourSlug: String(body.tourSlug ?? "").trim() || undefined,
      content,
    });
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
