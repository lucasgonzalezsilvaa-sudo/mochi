-- ============================================================
--  Los Viajes de Mochi — Esquema de Supabase
--  Ejecutá este archivo en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ---------- NOTAS (blog) ----------
create table if not exists public.notas (
  slug        text primary key,
  title       text not null,
  excerpt     text not null default '',
  date        text not null default '',
  cover       text not null default '',
  tags        text[] not null default '{}',
  author      text not null default 'Mochi',
  tour_slug   text,
  content     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- VIAJES (tours) ----------
create table if not exists public.viajes (
  slug         text primary key,
  name         text not null,
  place        text not null default '',
  dates        text not null default '',
  duration     text not null default '',
  image        text not null default '',
  images       text[] not null default '{}',
  blurb        text not null default '',
  intro        text[] not null default '{}',
  highlights   text[] not null default '{}',
  includes     text[] not null default '{}',
  accent       text not null default 'terra',
  price        text not null default '',
  price_before text,
  offer_ends_at text,
  offer_label  text,
  reviews      jsonb not null default '[]',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Migración: galería de imágenes por viaje ----------
-- Agrega la columna a bases ya creadas y rellena con la imagen principal existente.
alter table public.viajes add column if not exists images text[] not null default '{}';
update public.viajes
  set images = array[image]
  where array_length(images, 1) is null and coalesce(image, '') <> '';

-- ---------- Rate limiting del login ----------
-- Registra intentos fallidos por IP para frenar fuerza bruta en /admin.
create table if not exists public.login_attempts (
  id         bigint generated always as identity primary key,
  ip         text not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_ip_created_idx
  on public.login_attempts (ip, created_at);

-- Sin políticas: solo el servidor (service role) la usa; anon/public no acceden.
alter table public.login_attempts enable row level security;

-- ---------- Row Level Security ----------
-- Lectura pública (el sitio la usa para mostrar contenido).
-- La escritura ocurre solo desde el servidor con la service_role key,
-- que ignora RLS, así que no hace falta política de escritura pública.
alter table public.notas  enable row level security;
alter table public.viajes enable row level security;

drop policy if exists "notas_public_read"  on public.notas;
drop policy if exists "viajes_public_read" on public.viajes;

create policy "notas_public_read"  on public.notas  for select using (true);
create policy "viajes_public_read" on public.viajes for select using (true);

-- ---------- Storage: bucket público para imágenes ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;
