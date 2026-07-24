// Importa el contenido local (content/notas/*.md y content/viajes/*.json) a Supabase.
// Uso:  node --env-file=.env.local scripts/seed-supabase.mjs
//
// Idempotente: usa upsert por slug, así podés correrlo las veces que quieras.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Corré:  node --env-file=.env.local scripts/seed-supabase.mjs",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function readDir(dir, ext) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .map((f) => ({ slug: f.replace(ext, ""), full: path.join(full, f) }));
}

async function seedNotas() {
  const files = readDir("content/notas", ".md");
  if (!files.length) return console.log("· No hay notas locales para importar.");
  const rows = files.map(({ slug, full }) => {
    const { data, content } = matter(fs.readFileSync(full, "utf-8"));
    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: data.date ?? "",
      cover: data.cover ?? "/images/hero-atacama.jpg",
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author ?? "Mochi",
      tour_slug: data.tourSlug ?? null,
      content,
      updated_at: new Date().toISOString(),
    };
  });
  const { error } = await supabase.from("notas").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ ${rows.length} notas importadas.`);
}

async function seedViajes() {
  const files = readDir("content/viajes", ".json");
  if (!files.length) return console.log("· No hay viajes locales para importar.");
  const rows = files.map(({ slug, full }) => {
    const d = JSON.parse(fs.readFileSync(full, "utf-8"));
    return {
      slug,
      name: d.name ?? slug,
      place: d.place ?? "",
      dates: d.dates ?? "",
      duration: d.duration ?? "",
      image: d.image ?? "/images/hero-atacama.jpg",
      blurb: d.blurb ?? "",
      intro: Array.isArray(d.intro) ? d.intro : [],
      highlights: Array.isArray(d.highlights) ? d.highlights : [],
      includes: Array.isArray(d.includes) ? d.includes : [],
      accent: ["terra", "ocean", "sun"].includes(d.accent) ? d.accent : "terra",
      price: d.price ?? "",
      price_before: d.priceBefore ?? null,
      offer_ends_at: d.offerEndsAt ?? null,
      offer_label: d.offerLabel ?? null,
      reviews: Array.isArray(d.reviews) ? d.reviews : [],
      updated_at: new Date().toISOString(),
    };
  });
  const { error } = await supabase.from("viajes").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  console.log(`✓ ${rows.length} viajes importados.`);
}

try {
  await seedNotas();
  await seedViajes();
  console.log("\nListo. El contenido local ya está en Supabase. 🎉");
} catch (e) {
  console.error("\n✗ Error importando:", e.message ?? e);
  process.exit(1);
}
