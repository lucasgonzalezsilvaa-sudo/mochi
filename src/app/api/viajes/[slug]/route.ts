import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTour, deleteTour } from "@/lib/viajes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La autenticación (sesión con cookie) la resuelve src/proxy.ts.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json({ tour });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ok = await deleteTour(slug);
  if (!ok) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  revalidatePath("/");
  revalidatePath("/viajes");
  return NextResponse.json({ ok: true });
}
