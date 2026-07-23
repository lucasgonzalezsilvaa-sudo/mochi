import Link from "next/link";
import Image from "next/image";
import type { Tour } from "@/lib/viajes";
import OfferCountdown from "@/components/OfferCountdown";

const accentBg = {
  terra: "bg-terra",
  ocean: "bg-ocean",
  sun: "bg-sun",
} as const;

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/viajes/${tour.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-cream transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(33,29,24,0.45)]"
    >
      <div className="card-media relative aspect-[4/5] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full ${accentBg[tour.accent]} px-3 py-1 text-xs font-semibold text-white`}
        >
          {tour.dates}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs text-sand/90">{tour.place}</p>
          <h3 className="font-serif text-2xl text-cream">{tour.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">{tour.blurb}</p>

        {tour.price && (
          <div className="mt-4 flex items-baseline gap-2">
            {tour.priceBefore && (
              <span className="text-base text-muted line-through">{tour.priceBefore}</span>
            )}
            <span className="text-xl font-semibold text-terra-deep">{tour.price}</span>
          </div>
        )}

        {tour.offerEndsAt && (
          <OfferCountdown
            endsAt={tour.offerEndsAt}
            textSize="text-sm"
            className="mt-1.5 text-terra-deep"
          />
        )}

        <span className="btn mt-5 w-full bg-terra px-5 py-2.5 text-sm text-white transition-colors duration-200 group-hover:bg-terra-deep">
          Ver el viaje
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>

      {tour.offerLabel && (
        <div className="bg-terra-deep px-5 py-2.5 text-center text-xs font-semibold text-white">
          {tour.offerLabel}
        </div>
      )}
    </Link>
  );
}
