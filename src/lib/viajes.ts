import { supabaseAdmin } from "@/lib/supabase";
import { parseReviews } from "@/lib/viajes-shared";
import type { Review, Tour, TourReview } from "@/lib/viajes-shared";

export type { Review, Tour, TourReview } from "@/lib/viajes-shared";
export { parsePriceValue, getDiscountPercent } from "@/lib/viajes-shared";

type TourRow = {
  slug: string;
  name: string;
  place: string | null;
  dates: string | null;
  duration: string | null;
  image: string | null;
  images: string[] | null;
  blurb: string | null;
  intro: string[] | null;
  highlights: string[] | null;
  includes: string[] | null;
  accent: string | null;
  price: string | null;
  price_before: string | null;
  offer_ends_at: string | null;
  offer_label: string | null;
  reviews: unknown;
};

function rowToTour(row: TourRow): Tour {
  // La galería es la fuente de verdad; si está vacía, cae a la imagen principal.
  const gallery =
    Array.isArray(row.images) && row.images.length > 0
      ? row.images.filter(Boolean)
      : row.image
        ? [row.image]
        : [];
  const cover = gallery[0] ?? row.image ?? "/images/hero-atacama.jpg";
  return {
    slug: row.slug,
    name: row.name ?? row.slug,
    place: row.place ?? "",
    dates: row.dates ?? "",
    duration: row.duration ?? "",
    image: cover,
    images: gallery.length > 0 ? gallery : [cover],
    blurb: row.blurb ?? "",
    intro: Array.isArray(row.intro) ? row.intro : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    includes: Array.isArray(row.includes) ? row.includes : [],
    accent: ["terra", "ocean", "sun"].includes(row.accent ?? "")
      ? (row.accent as "terra" | "ocean" | "sun")
      : "terra",
    price: row.price ?? "",
    priceBefore: row.price_before || undefined,
    offerEndsAt: row.offer_ends_at || undefined,
    offerLabel: row.offer_label || undefined,
    reviews: parseReviews(row.reviews),
  };
}

export async function getSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin().from("viajes").select("slug");
  if (error) throw error;
  return (data ?? []).map((r) => r.slug as string);
}

export async function getTour(slug: string): Promise<Tour | null> {
  const { data, error } = await supabaseAdmin()
    .from("viajes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToTour(data as TourRow) : null;
}

export async function getAllTours(): Promise<Tour[]> {
  const { data, error } = await supabaseAdmin()
    .from("viajes")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => rowToTour(r as TourRow));
}

/** Todas las reseñas de todos los viajes, para la sección agregada. */
export async function getAllReviews(): Promise<TourReview[]> {
  const tours = await getAllTours();
  return tours.flatMap((t) =>
    t.reviews.map((r) => ({ ...r, tourSlug: t.slug, tourName: t.name })),
  );
}

/** Convierte un nombre en un slug seguro para URL. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveTour(input: {
  slug: string;
  name: string;
  place: string;
  dates: string;
  duration: string;
  image?: string;
  images?: string[];
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
}): Promise<void> {
  const gallery = (input.images ?? (input.image ? [input.image] : [])).filter(Boolean);
  const cover = gallery[0] ?? input.image ?? "";
  const { error } = await supabaseAdmin()
    .from("viajes")
    .upsert(
      {
        slug: input.slug,
        name: input.name,
        place: input.place,
        dates: input.dates,
        duration: input.duration,
        image: cover,
        images: gallery,
        blurb: input.blurb,
        intro: input.intro,
        highlights: input.highlights,
        includes: input.includes,
        accent: input.accent,
        price: input.price,
        price_before: input.priceBefore ?? null,
        offer_ends_at: input.offerEndsAt ?? null,
        offer_label: input.offerLabel ?? null,
        reviews: parseReviews(input.reviews),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
  if (error) throw error;
}

export async function deleteTour(slug: string): Promise<boolean> {
  const { error, count } = await supabaseAdmin()
    .from("viajes")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) throw error;
  return (count ?? 0) > 0;
}
