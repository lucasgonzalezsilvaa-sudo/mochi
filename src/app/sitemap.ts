import type { MetadataRoute } from "next";
import { getAllNotas } from "@/lib/notas";
import { site, tours } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const notas = getAllNotas().map((n) => ({
    url: `${site.url}/notas/${n.slug}`,
    lastModified: n.date ? new Date(n.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const viajes = tours.map((t) => ({
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
