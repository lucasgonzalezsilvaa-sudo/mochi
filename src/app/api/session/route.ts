import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, AUTH_COOKIE, sessionToken } from "@/lib/auth";
import {
  clientIp,
  isRateLimited,
  recordFailedAttempt,
  clearAttempts,
} from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Iniciar sesión: valida la contraseña y guarda la cookie. */
export async function POST(req: Request) {
  const ip = clientIp(req);

  // Freno a fuerza bruta: demasiados fallos recientes desde esta IP.
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos fallidos. Esperá unos minutos e intentá de nuevo." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = String((body as { password?: unknown }).password ?? "");

  if (password !== ADMIN_PASSWORD) {
    await recordFailedAttempt(ip);
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  await clearAttempts(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, await sessionToken(), {
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
