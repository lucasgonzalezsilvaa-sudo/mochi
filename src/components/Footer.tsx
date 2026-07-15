import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand-2/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-ink">Los Viajes de Mochi</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            {site.tagline}
          </p>
        </div>

        <div>
          <p className="kicker text-muted">Explorar</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/#viajes" className="hover:text-terra">
                Próximos viajes
              </Link>
            </li>
            <li>
              <Link href="/notas" className="hover:text-terra">
                Notas de viaje
              </Link>
            </li>
            <li>
              <Link href="/#sobre-mi" className="hover:text-terra">
                Sobre mí
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker text-muted">Escribime</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-terra">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-terra">
                Instagram {site.instagramHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-terra">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Los Viajes de Mochi. Todos los derechos reservados.</p>
          <p>Hecho con cariño para viajar distinto.</p>
        </div>
      </div>
    </footer>
  );
}
