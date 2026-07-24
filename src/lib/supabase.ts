import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente de Supabase para uso EXCLUSIVO en el servidor (RSC y route handlers).
// Usa la service_role key, que nunca debe llegar al navegador.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Bucket de Storage donde se guardan las imágenes subidas desde el panel. */
export const MEDIA_BUCKET = "media";

let cached: SupabaseClient | null = null;

/**
 * Devuelve el cliente admin de Supabase. Lanza un error claro si faltan las
 * variables de entorno, para no fallar en silencio.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error(
      "Faltan variables de Supabase. Configurá NEXT_PUBLIC_SUPABASE_URL y " +
        "SUPABASE_SERVICE_ROLE_KEY en .env.local (local) y en Vercel (producción).",
    );
  }
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
