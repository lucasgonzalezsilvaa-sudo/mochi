import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_TOKEN } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const authed = req.cookies.get(AUTH_COOKIE)?.value === AUTH_TOKEN;
  const { pathname } = req.nextUrl;

  // API de notas y viajes: leer es público, escribir/borrar exige sesión.
  if (pathname.startsWith("/api/notas") || pathname.startsWith("/api/viajes")) {
    if (req.method === "GET" || authed) return NextResponse.next();
    return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  }

  // Subida de imágenes: siempre exige sesión.
  if (pathname.startsWith("/api/upload")) {
    if (authed) return NextResponse.next();
    return NextResponse.json({ error: "Sesión requerida" }, { status: 401 });
  }

  // Panel: la página de login es abierta; el resto exige sesión.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (authed) return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.next();
    }
    if (!authed) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/notas",
    "/api/notas/:path*",
    "/api/viajes",
    "/api/viajes/:path*",
    "/api/upload",
  ],
};
