import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import NoteCard from "@/components/NoteCard";
import { getAllNotas } from "@/lib/notas";

export const metadata: Metadata = {
  title: "Notas de viaje",
  description:
    "Consejos, rutas y experiencias para viajar distinto por Sudamérica. El diario de viaje de Mochi.",
};

export const dynamic = "force-dynamic";

export default async function NotasPage() {
  const notas = await getAllNotas();

  return (
    <div className="pt-16">
      <section className="border-b border-line bg-sand-2/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal>
            <p className="kicker text-terra">El diario</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink sm:text-6xl">
              Notas de viaje
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Consejos prácticos, rutas y pequeñas historias del camino. Todo lo que
              aprendo viajando, para que tu próximo viaje sea más fácil.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        {notas.length === 0 ? (
          <p className="text-ink-soft">
            Todavía no hay notas publicadas. ¡Pronto habrá historias por acá!
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {notas.map((nota, i) => (
              <Reveal key={nota.slug} delay={(i % 3) * 80}>
                <NoteCard nota={nota} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
