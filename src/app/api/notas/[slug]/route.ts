import { NextResponse } from "next/server";
import { getNota, deleteNota } from "@/lib/notas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La autenticación (sesión con cookie) la resuelve src/middleware.ts.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const nota = getNota(slug);
  if (!nota) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json({ nota });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ok = deleteNota(slug);
  if (!ok) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
