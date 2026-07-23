import fs from "node:fs";
import path from "node:path";

export const VIAJES_DIR = path.join(process.cwd(), "content", "viajes");

export type Review = {
  photo: string;
  name: string;
  opinion: string;
};

export type Tour = {
  slug: string;
  name: string;
  place: string;
  dates: string;
  duration: string;
  image: string;
  blurb: string;
  intro: string[];
  highlights: string[];
  includes: string[];
  accent: "terra" | "ocean" | "sun";
  price: string;
  priceBefore?: string;
  offerEndsAt?: string;
  offerLabel?: string;
  reviews: Review[];
};

function parseReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((r) => ({
      photo: String(r?.photo ?? ""),
      name: String(r?.name ?? "").trim(),
      opinion: String(r?.opinion ?? "").trim(),
    }))
    .filter((r) => r.name && r.opinion);
}

function ensureDir() {
  if (!fs.existsSync(VIAJES_DIR)) {
    fs.mkdirSync(VIAJES_DIR, { recursive: true });
  }
}

export function getSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(VIAJES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getTour(slug: string): Tour | null {
  const file = path.join(VIAJES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);
  return {
    slug,
    name: data.name ?? slug,
    place: data.place ?? "",
    dates: data.dates ?? "",
    duration: data.duration ?? "",
    image: data.image ?? "/images/hero-atacama.jpg",
    blurb: data.blurb ?? "",
    intro: Array.isArray(data.intro) ? data.intro : [],
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    includes: Array.isArray(data.includes) ? data.includes : [],
    accent: ["terra", "ocean", "sun"].includes(data.accent) ? data.accent : "terra",
    price: data.price ?? "",
    priceBefore: data.priceBefore || undefined,
    offerEndsAt: data.offerEndsAt || undefined,
    offerLabel: data.offerLabel || undefined,
    reviews: parseReviews(data.reviews),
  };
}

export function getAllTours(): Tour[] {
  return getSlugs()
    .map((slug) => getTour(slug))
    .filter((t): t is Tour => t !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type TourReview = Review & { tourSlug: string; tourName: string };

/** Todas las reseñas de todos los viajes, para mostrar en una sección agregada. */
export function getAllReviews(): TourReview[] {
  return getAllTours().flatMap((t) =>
    t.reviews.map((r) => ({ ...r, tourSlug: t.slug, tourName: t.name })),
  );
}

/** Convierte un título en un slug seguro para nombre de archivo/URL. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // quita acentos combinados
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Serializa un viaje a JSON y lo guarda en disco. */
export function saveTour(input: {
  slug: string;
  name: string;
  place: string;
  dates: string;
  duration: string;
  image: string;
  blurb: string;
  intro: string[];
  highlights: string[];
  includes: string[];
  accent: "terra" | "ocean" | "sun";
  price: string;
  priceBefore?: string;
  offerEndsAt?: string;
  offerLabel?: string;
  reviews?: Review[];
}): void {
  ensureDir();
  const data: Tour = {
    slug: input.slug,
    name: input.name,
    place: input.place,
    dates: input.dates,
    duration: input.duration,
    image: input.image,
    blurb: input.blurb,
    intro: input.intro,
    highlights: input.highlights,
    includes: input.includes,
    accent: input.accent,
    price: input.price,
    priceBefore: input.priceBefore || undefined,
    offerEndsAt: input.offerEndsAt || undefined,
    offerLabel: input.offerLabel || undefined,
    reviews: parseReviews(input.reviews),
  };
  fs.writeFileSync(
    path.join(VIAJES_DIR, `${input.slug}.json`),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export function deleteTour(slug: string): boolean {
  const file = path.join(VIAJES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}
