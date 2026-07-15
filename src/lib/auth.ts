// ============================================================
//  Login del panel de administración (MVP, contraseña simple)
//  Cambiá la contraseña acá abajo, o definí ADMIN_PASSWORD en Vercel.
// ============================================================

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "mochi2026";

/** Nombre de la cookie de sesión. */
export const AUTH_COOKIE = "mochi_admin";

/** Valor que se guarda en la cookie al iniciar sesión correctamente. */
export const AUTH_TOKEN = process.env.ADMIN_TOKEN ?? "mochi-sesion-ok";
