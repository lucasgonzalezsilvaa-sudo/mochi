import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const NOTAS_DIR = path.join(process.cwd(), "content", "notas");

export type Nota = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO YYYY-MM-DD
  cover: string;
  tags: string[];
  author: string;
  tourSlug?: string; // slug del viaje relacionado (opcional)
  content: string; // cuerpo Markdown
};

function ensureDir() {
  if (!fs.existsSync(NOTAS_DIR)) {
    fs.mkdirSync(NOTAS_DIR, { recursive: true });
  }
}

export function getSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(NOTAS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getNota(slug: string): Nota | null {
  const file = path.join(NOTAS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date: data.date ?? "",
    cover: data.cover ?? "/images/hero-atacama.jpg",
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? "Mochi",
    tourSlug: data.tourSlug || undefined,
    content,
  };
}

export function getAllNotas(): Nota[] {
  return getSlugs()
    .map((slug) => getNota(slug))
    .filter((n): n is Nota => n !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Convierte un tÃ­tulo en un slug seguro para nombre de archivo/URL. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // quita acentos combinados
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Serializa una nota a Markdown con frontmatter y la guarda en disco. */
export function saveNota(input: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  tags: string[];
  author: string;
  tourSlug?: string;
  content: string;
}): void {
  ensureDir();
  const fileData = matter.stringify(input.content ?? "", {
    title: input.title,
    excerpt: input.excerpt,
    date: input.date,
    cover: input.cover,
    tags: input.tags,
    author: input.author,
    ...(input.tourSlug ? { tourSlug: input.tourSlug } : {}),
  });
  fs.writeFileSync(path.join(NOTAS_DIR, `${input.slug}.md`), fileData, "utf-8");
}

export function deleteNota(slug: string): boolean {
  const file = path.join(NOTAS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}
