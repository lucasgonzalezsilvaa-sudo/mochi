import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { getAllTours, getTour } from "@/lib/viajes";
import TourCard from "@/components/TourCard";
import TourGallery from "@/components/TourGallery";
import OfferCountdown from "@/components/OfferCountdown";
import ReviewCard from "@/components/ReviewCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return {};
  return {
    title: `${tour.name} — ${tour.dates}`,
    description: tour.blurb,
    openGraph: {
      type: "article",
      title: tour.name,
      description: tour.blurb,
      images: [tour.image],
    },
  };
}

export default async function ViajePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const otros = (await getAllTours()).filter((t) => t.slug !== tour.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.blurb,
    image: tour.images.map((src) =>
      src.startsWith("http") ? src : `${site.url}${src}`,
    ),
    touristType: "Grupos reducidos",
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.highlights.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: h,
      })),
    },
  };

  return (
    <article className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero del viaje */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/20" />
        <div className="relative mx-auto w-full max-w-4xl px-5 pb-14 pt-28 sm:px-8">
          <Link
            href="/#viajes"
            className="text-sm text-sand/80 transition-colors hover:text-cream"
          >
            ← Todos los viajes
          </Link>
          <p className="kicker mt-5 text-sand/80">{tour.place}</p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-cream sm:text-6xl">
            {tour.name}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-cream backdrop-blur-sm">
              📅 {tour.dates}
            </span>
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-cream backdrop-blur-sm">
              ⏱️ {tour.duration}
            </span>
          </div>
        </div>
      </section>

      {/* Galería de fotos */}
      {tour.images.length > 1 && (
        <section className="mx-auto max-w-4xl px-5 pt-16 sm:px-8">
          <h2 className="mb-6 font-serif text-2xl text-ink">Galería</h2>
          <TourGallery images={tour.images} name={tour.name} />
        </section>
      )}

      {/* Contenido */}
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_300px]">
          {/* Columna principal */}
          <div>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              {tour.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 font-serif text-2xl text-ink">
              Lo que vamos a vivir
            </h2>
            <ul className="mt-5 space-y-3">
              {tour.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-ink-soft">
                  <span className="mt-1 text-terra">◆</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Barra lateral */}
          <aside className="md:sticky md:top-24 md:self-start">
            <div className="rounded-2xl border border-line bg-cream p-6">
              {tour.price && (
                <div className="flex items-baseline gap-2">
                  {tour.priceBefore && (
                    <span className="text-base text-muted line-through">
                      {tour.priceBefore}
                    </span>
                  )}
                  <span className="font-serif text-2xl text-terra-deep">{tour.price}</span>
                </div>
              )}
              {tour.offerEndsAt && (
                <OfferCountdown
                  endsAt={tour.offerEndsAt}
                  textSize="text-sm"
                  className="mt-1.5 text-terra-deep"
                />
              )}

              <p className="kicker mt-5 text-terra">Incluye</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {tour.includes.map((inc) => (
                  <li key={inc} className="flex gap-2">
                    <span className="text-ocean">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(
                  `Hola, vengo desde la web! Me interesa el viaje "${tour.name}".`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-6 w-full bg-terra px-5 py-3 text-white hover:bg-terra-deep"
              >
                Quiero sumarme
              </a>
              <p className="mt-3 text-center text-xs text-muted">
                Cupos limitados · grupo reducido
              </p>
            </div>
            {tour.offerLabel && (
              <div className="mt-3 rounded-xl bg-terra-deep px-4 py-2.5 text-center text-xs font-semibold text-white">
                {tour.offerLabel}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Reseñas del viaje */}
      {tour.reviews.length > 0 && (
        <section className="bg-sand-2/50">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
            <h2 className="font-serif text-2xl text-ink">Lo que dicen quienes viajaron</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {tour.reviews.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Otros viajes */}
      {otros.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-4 sm:px-8">
          <h2 className="font-serif text-2xl text-ink">Otros viajes</h2>
          <div className="mt-6 grid gap-7 sm:grid-cols-2">
            {otros.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
