import { supabaseAdmin } from "@/lib/supabase";

// Rate limiting de login basado en Supabase (tabla login_attempts).
// Diseño fail-open: si la tabla no existe o Supabase falla, NO bloquea el login
// legítimo; el límite simplemente queda inactivo hasta que la tabla esté.

const WINDOW_MIN = 15; // ventana de tiempo
const MAX_ATTEMPTS = 5; // fallos permitidos por IP dentro de la ventana

/** Obtiene la IP del cliente. En Vercel viene confiable en x-forwarded-for. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "desconocida";
}

/** true si la IP superó el máximo de intentos fallidos en la ventana. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
  const { count, error } = await supabaseAdmin()
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if (error) return false; // fail-open: ante error, no bloquear
  return (count ?? 0) >= MAX_ATTEMPTS;
}

/** Registra un intento fallido y limpia filas viejas de forma oportunista. */
export async function recordFailedAttempt(ip: string): Promise<void> {
  try {
    const db = supabaseAdmin();
    await db.from("login_attempts").insert({ ip });
    const cutoff = new Date(Date.now() - 60 * 60_000).toISOString(); // > 1h
    await db.from("login_attempts").delete().lt("created_at", cutoff);
  } catch {
    // nunca romper el login por un fallo del limiter
  }
}

/** Limpia los intentos de una IP tras un login exitoso. */
export async function clearAttempts(ip: string): Promise<void> {
  try {
    await supabaseAdmin().from("login_attempts").delete().eq("ip", ip);
  } catch {
    // ignorar
  }
}

export { WINDOW_MIN, MAX_ATTEMPTS };
