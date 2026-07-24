import type { MetadataRoute } from "next";
import { getAllNotas } from "@/lib/notas";
import { getAllTours } from "@/lib/viajes";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allNotas, allTours] = await Promise.all([getAllNotas(), getAllTours()]);

  const notas = allNotas.map((n) => ({
    url: `${site.url}/notas/${n.slug}`,
    lastModified: n.date ? new Date(n.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const viajes = allTours.map((t) => ({
    url: `${site.url}/viajes/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/viajes`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/notas`, changeFrequency: "weekly", priority: 0.8 },
    ...viajes,
    ...notas,
  ];
}
