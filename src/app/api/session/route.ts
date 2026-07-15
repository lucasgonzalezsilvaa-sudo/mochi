import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, AUTH_COOKIE, AUTH_TOKEN } from "@/lib/auth";

export const runtime = "nodejs";

/** Iniciar sesión: valida la contraseña y guarda la cookie. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String((body as { password?: unknown }).password ?? "");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });
  return res;
}

/** Cerrar sesión: borra la cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
