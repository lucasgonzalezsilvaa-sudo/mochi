import { supabaseAdmin } from "@/lib/supabase";

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

type NotaRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  cover: string | null;
  tags: string[] | null;
  author: string | null;
  tour_slug: string | null;
  content: string | null;
};

function rowToNota(row: NotaRow): Nota {
  return {
    slug: row.slug,
    title: row.title ?? row.slug,
    excerpt: row.excerpt ?? "",
    date: row.date ?? "",
    cover: row.cover ?? "/images/hero-atacama.jpg",
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: row.author ?? "Mochi",
    tourSlug: row.tour_slug || undefined,
    content: row.content ?? "",
  };
}

export async function getSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin().from("notas").select("slug");
  if (error) throw error;
  return (data ?? []).map((r) => r.slug as string);
}

export async function getNota(slug: string): Promise<Nota | null> {
  const { data, error } = await supabaseAdmin()
    .from("notas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToNota(data as NotaRow) : null;
}

export async function getAllNotas(): Promise<Nota[]> {
  const { data, error } = await supabaseAdmin()
    .from("notas")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => rowToNota(r as NotaRow));
}

/** Convierte un título en un slug seguro para URL. */
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

export async function saveNota(input: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover: string;
  tags: string[];
  author: string;
  tourSlug?: string;
  content: string;
}): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("notas")
    .upsert(
      {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        date: input.date,
        cover: input.cover,
        tags: input.tags,
        author: input.author,
        tour_slug: input.tourSlug ?? null,
        content: input.content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
  if (error) throw error;
}

export async function deleteNota(slug: string): Promise<boolean> {
  const { error, count } = await supabaseAdmin()
    .from("notas")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) throw error;
  return (count ?? 0) > 0;
}
