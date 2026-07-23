"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import { parsePriceValue, getDiscountPercent, type Tour } from "@/lib/viajes-shared";

const SORT_OPTIONS = [
  { value: "default", label: "Orden por defecto" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "discount", label: "Mayor descuento" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function ToursGrid({ tours }: { tours: Tour[] }) {
  const [sort, setSort] = useState<SortValue>("default");

  const sorted = useMemo(() => {
    if (sort === "default") return tours;
    const list = [...tours];
    if (sort === "price-asc") {
      list.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
    } else if (sort === "discount") {
      list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    }
    return list;
  }, [tours, sort]);

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-terra focus:ring-2 focus:ring-terra/20"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((tour, i) => (
          <Reveal key={tour.slug} delay={(i % 3) * 80} as="article">
            <TourCard tour={tour} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
