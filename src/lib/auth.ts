// ============================================================
//  Login del panel de administración (MVP, contraseña simple)
//  Cambiá la contraseña con la variable de entorno ADMIN_PASSWORD.
// ============================================================

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "mochi2026";

/** Nombre de la cookie de sesión. */
export const AUTH_COOKIE = "mochi_admin";

/**
 * Token que se guarda en la cookie al iniciar sesión.
 * Se deriva (SHA-256) de ADMIN_PASSWORD, así NO es un valor público:
 * aunque el repositorio sea público, sin conocer la contraseña no se puede
 * forjar una cookie válida. Funciona tanto en Node como en el Edge runtime.
 */
export async function sessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`mochi-session::v1::${ADMIN_PASSWORD}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
