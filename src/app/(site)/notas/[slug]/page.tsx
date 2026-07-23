import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllNotas, getNota, getSlugs } from "@/lib/notas";
import { site, whatsappLink } from "@/lib/site";
import { getTour } from "@/lib/viajes";
import NoteCard from "@/components/NoteCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nota = getNota(slug);
  if (!nota) return {};
  return {
    title: nota.title,
    description: nota.excerpt,
    openGraph: {
      type: "article",
      title: nota.title,
      description: nota.excerpt,
      publishedTime: nota.date,
      images: [nota.cover],
    },
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NotaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nota = getNota(slug);
  if (!nota) notFound();

  const otras = getAllNotas()
    .filter((n) => n.slug !== nota.slug)
    .slice(0, 3);

  const relatedTour = nota.tourSlug ? getTour(nota.tourSlug) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: nota.title,
    description: nota.excerpt,
    image: `${site.url}${nota.cover}`,
    datePublished: nota.date,
    author: { "@type": "Person", name: nota.author },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cabecera */}
      <header className="mx-auto max-w-3xl px-5 pt-14 sm:px-8">
        <Link
          href="/notas"
          className="text-sm text-muted transition-colors hover:text-terra"
        >
          ← Todas las notas
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{formatDate(nota.date)}</span>
          <span aria-hidden>·</span>
          <span>{nota.author}</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-5xl">
          {nota.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{nota.excerpt}</p>
        {nota.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {nota.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-sand-2 px-3 py-1 text-xs text-ink-soft"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Imagen de portada */}
      <div className="mx-auto mt-10 max-w-4xl px-5 sm:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={nota.cover}
            alt={nota.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="prose mx-auto mt-12 max-w-2xl px-5 sm:px-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{nota.content}</ReactMarkdown>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-16 max-w-2xl px-5 sm:px-8">
        <div className="rounded-2xl border border-line bg-sand-2/60 p-8 text-center">
          {relatedTour ? (
            <>
              <p className="font-serif text-2xl text-ink">¿Te dieron ganas de viajar?</p>
              <p className="mt-2 text-ink-soft">
                Este viaje te puede interesar: {relatedTour.name}.
              </p>
              <Link
                href={`/viajes/${relatedTour.slug}`}
                className="btn mt-5 bg-terra px-6 py-3 text-white hover:bg-terra-deep"
              >
                Ver viaje: {relatedTour.name}
              </Link>
            </>
          ) : (
            <>
              <p className="font-serif text-2xl text-ink">¿Te dieron ganas de viajar?</p>
              <p className="mt-2 text-ink-soft">
                Contame a dónde y armamos tu próximo viaje.
              </p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-5 bg-terra px-6 py-3 text-white hover:bg-terra-deep"
              >
                Escribime por WhatsApp
              </a>
            </>
          )}
        </div>
      </div>

      {/* Más notas */}
      {otras.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-2xl text-ink">Seguí leyendo</h2>
          <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {otras.map((n) => (
              <NoteCard key={n.slug} nota={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
