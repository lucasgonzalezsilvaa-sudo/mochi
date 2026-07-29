/**
 * Serializa un objeto a JSON para inyectar en un <script type="application/ld+json">
 * de forma segura: escapa los caracteres que podrían cerrar el <script> o romper
 * el HTML (`<`, `>`, `&`) y los separadores de línea Unicode. Evita XSS aunque el
 * contenido venga del panel de administración.
 */
export function jsonLdSafe(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(new RegExp("\\u2028", "g"), "\\u2028")
    .replace(new RegExp("\\u2029", "g"), "\\u2029");
}
