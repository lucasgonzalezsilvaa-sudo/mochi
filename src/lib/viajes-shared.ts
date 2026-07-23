// Tipos y helpers puros (sin fs), para poder importarlos también desde
// componentes cliente. La lectura/escritura en disco vive en viajes.ts.

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

export type TourReview = Review & { tourSlug: string; tourName: string };

export function parseReviews(value: unknown): Review[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((r) => ({
      photo: String(r?.photo ?? ""),
      name: String(r?.name ?? "").trim(),
      opinion: String(r?.opinion ?? "").trim(),
    }))
    .filter((r) => r.name && r.opinion);
}

/** Extrae el valor numérico de un precio en texto libre (ej. "USD 1.350" -> 1350). */
export function parsePriceValue(price: string): number {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : NaN;
}

/** Porcentaje de descuento del viaje (0 si no tiene precio anterior u oferta). */
export function getDiscountPercent(tour: Tour): number {
  if (!tour.priceBefore) return 0;
  const before = parsePriceValue(tour.priceBefore);
  const now = parsePriceValue(tour.price);
  if (!before || Number.isNaN(before) || Number.isNaN(now) || before <= now) return 0;
  return ((before - now) / before) * 100;
}
