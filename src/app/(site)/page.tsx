import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import NoteCard from "@/components/NoteCard";
import TourCard from "@/components/TourCard";
import CoordinatorCard from "@/components/CoordinatorCard";
import ReviewCard from "@/components/ReviewCard";
import { site, coordinators } from "@/lib/site";
import { getAllTours, getAllReviews } from "@/lib/viajes";
import { getAllNotas } from "@/lib/notas";

export default function Home() {
  const notas = getAllNotas().slice(0, 3);
  const tours = getAllTours();
  const reviews = getAllReviews();

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <Image
          src="/images/hero-atacama.jpg"
          alt="Paisaje del desierto de Atacama al atardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/25" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8">
          <Reveal>
            <p className="kicker text-sand/80">Viajes en grupos reducidos · Sudamérica</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] text-cream sm:text-6xl md:text-7xl">
              Algunos viajes cambian el destino.
              <span className="italic text-sand"> Otros, la manera de mirar el mundo.</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand/90">
              Soy Mochi. Armo viajes en grupos chicos para recorrer Sudamérica sin
              apuro, con vínculos reales y tiempo para lo que de verdad importa.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#viajes"
                className="btn bg-terra px-6 py-3.5 text-base text-white shadow-lg hover:bg-terra-deep"
              >
                Ver próximos viajes
              </Link>
              <Link
                href="/notas"
                className="btn border border-sand/40 bg-white/5 px-6 py-3.5 text-base text-cream backdrop-blur-sm hover:bg-white/15"
              >
                Leer mis notas
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== FRASE / INTRO ============== */}
      <section className="border-b border-line bg-sand-2/50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <Reveal>
            <p className="font-serif text-2xl leading-relaxed text-ink sm:text-3xl">
              No vendo destinos. Comparto una forma de viajar: despacio, presente y
              en buena compañía. Grupos chicos, experiencias reales y el espacio para
              que cada viaje te cambie a su manera.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============== VIAJES ============== */}
      <section id="viajes" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <p className="kicker text-terra">Próximas salidas</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl text-ink sm:text-5xl">
            Viajes con cupos limitados
          </h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            Grupos reducidos que se llenan rápido. Cada salida tiene su itinerario y
            todo resuelto para que solo te ocupes de disfrutar.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {tours.map((tour, i) => (
            <Reveal key={tour.slug} delay={i * 90} as="article">
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============== SOBRE MÍ ============== */}
      <section id="sobre-mi" className="bg-sand-2/50">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-2">
          <Reveal className="order-2 md:order-1">
            <p className="kicker text-terra">Sobre mí</p>
            <h2 className="mt-3 font-serif text-3xl text-ink sm:text-5xl">
              Hola, soy Mochi
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Viajero, fotógrafo y comunicador. Empecé documentando mis propios
                viajes y, sin darme cuenta, eso se transformó en una forma de invitar
                a otras personas a viajar distinto.
              </p>
              <p>
                Creo en los grupos chicos, en las mañanas sin plan y en las charlas
                que aparecen en el camino. Mi trabajo es que vos solo tengas que
                estar presente; del resto me ocupo yo.
              </p>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-8 bg-ink px-6 py-3.5 text-base text-cream hover:bg-ink-soft"
            >
              Seguime en Instagram
            </a>
          </Reveal>

          <Reveal delay={120} className="order-1 md:order-2">
            <div className="relative mx-auto max-w-sm">
              <div className="card-media group relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="/images/about-mochi.jpg"
                  alt="Retrato de Mochi"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden w-40 overflow-hidden rounded-2xl border-4 border-sand shadow-lg sm:block">
                <Image
                  src="/images/about-mochi-2.jpg"
                  alt=""
                  width={200}
                  height={150}
                  className="aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== COORDINADORES ============== */}
      {coordinators.length > 0 && (
        <section id="coordinadores" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <p className="kicker text-terra">Quiénes te acompañan</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl text-ink sm:text-5xl">
              Coordinadores de viaje
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">
              Cada grupo viaja acompañado de punta a punta, para que solo tengas que
              disfrutar.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
            {coordinators.map((c, i) => (
              <Reveal key={c.name} delay={i * 90}>
                <CoordinatorCard coordinator={c} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============== RESEÑAS ============== */}
      {reviews.length > 0 && (
        <section className="bg-sand-2/50">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <Reveal>
              <p className="kicker text-terra">Lo que dicen</p>
              <h2 className="mt-3 max-w-2xl font-serif text-3xl text-ink sm:text-5xl">
                Reseñas de viajeros
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft">
                Historias de quienes ya viajaron con Mochi.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
              {reviews.map((r, i) => (
                <Reveal key={`${r.tourSlug}-${i}`} delay={i * 90}>
                  <ReviewCard review={r} tourName={r.tourName} tourSlug={r.tourSlug} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============== NOTAS ============== */}
      {notas.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker text-terra">Notas de viaje</p>
                <h2 className="mt-3 font-serif text-3xl text-ink sm:text-5xl">
                  Historias y consejos
                </h2>
              </div>
              <Link
                href="/notas"
                className="text-sm font-medium text-terra hover:text-terra-deep"
              >
                Ver todas las notas →
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 md:grid-cols-3">
            {notas.map((nota, i) => (
              <Reveal key={nota.slug} delay={i * 90}>
                <NoteCard nota={nota} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============== CONTACTO ============== */}
      <section id="contacto" className="mx-auto max-w-6xl px-5 pb-4 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center sm:px-16">
            <div className="absolute inset-0 opacity-25">
              <Image
                src="/images/patagonia.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-serif text-3xl text-cream sm:text-5xl">
                ¿Te imaginás en el próximo viaje?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sand/85">
                Contame qué destino te llama y armamos juntos tu lugar en el grupo.
                Sin compromiso, con toda la info.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-terra px-7 py-3.5 text-base text-white shadow-lg hover:bg-terra-deep"
                >
                  Escribir por WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="btn border border-sand/40 px-7 py-3.5 text-base text-cream hover:bg-white/10"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
