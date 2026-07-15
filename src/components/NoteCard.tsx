import Link from "next/link";
import Image from "next/image";
import type { Nota } from "@/lib/notas";

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

export default function NoteCard({ nota }: { nota: Nota }) {
  return (
    <Link
      href={`/notas/${nota.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-cream transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(33,29,24,0.4)]"
    >
      <div className="card-media relative aspect-[16/10] overflow-hidden">
        <Image
          src={nota.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{formatDate(nota.date)}</span>
          {nota.tags[0] && (
            <>
              <span aria-hidden>·</span>
              <span className="text-terra-deep">#{nota.tags[0]}</span>
            </>
          )}
        </div>
        <h3 className="mt-2 font-serif text-xl leading-snug text-ink transition-colors duration-200 group-hover:text-terra-deep">
          {nota.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {nota.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terra">
          Leer nota
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
