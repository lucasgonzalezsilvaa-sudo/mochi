import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import { tours } from "@/lib/site";

export const metadata: Metadata = {
  title: "Próximos viajes",
  description:
    "Viajes en grupos reducidos por Sudamérica con Mochi. Atacama, Colombia y Patagonia: cupos limitados y todo resuelto.",
};

export default function ViajesPage() {
  return (
    <div className="pt-16">
      <section className="border-b border-line bg-sand-2/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <p className="kicker text-terra">Próximas salidas</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink sm:text-6xl">
              Viajes con cupos limitados
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Grupos reducidos que se llenan rápido. Cada salida tiene su itinerario y
              todo resuelto para que solo te ocupes de disfrutar.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour, i) => (
            <Reveal key={tour.slug} delay={(i % 3) * 80} as="article">
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
