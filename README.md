# Los Viajes de Mochi

Landing + blog + panel de administración para Mochi (viajes en grupos reducidos por
Sudamérica). **Next.js 16 + Tailwind CSS 4 + Supabase.**

Todo el contenido —notas, viajes, reseñas e imágenes— se gestiona desde `/admin` y se
guarda en **Supabase** (Postgres + Storage), así el panel funciona **deployado en
Vercel** y las ediciones aparecen online al instante.

## Puesta en marcha

### 1. Instalar

```bash
npm install
```

### 2. Crear el proyecto de Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto (plan free alcanza).
2. En **SQL Editor → New query**, pegá y ejecutá el contenido de
   [`supabase/schema.sql`](supabase/schema.sql). Eso crea las tablas `notas` y
   `viajes` y el bucket de imágenes `media`.

### 3. Variables de entorno

Copiá `.env.example` a `.env.local` y completá con los valores de tu proyecto
(**Supabase → Project Settings → API**):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ADMIN_PASSWORD=una-contraseña-tuya
```

> `SUPABASE_SERVICE_ROLE_KEY` es secreta: se usa solo en el servidor y nunca llega al
> navegador. No la subas a Git (`.env.local` está ignorado).

### 4. Cargar el contenido inicial (opcional)

Importa las notas y viajes de ejemplo (`content/`) a tu base:

```bash
npm run seed
```

### 5. Correr

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Panel admin: http://localhost:3000/admin (contraseña = `ADMIN_PASSWORD`)

## Cómo se gestiona el contenido

Todo desde `/admin`, en dos pestañas:

- **Notas** — crear/editar/borrar entradas del blog (Markdown), portada, etiquetas y
  viaje relacionado.
- **Viajes** — crear/editar/borrar viajes con precio, oferta con cuenta regresiva,
  highlights, incluye y reseñas.

Las imágenes se suben desde el panel y se guardan en Supabase Storage. Cada cambio se
refleja en el sitio al instante (revalidación on-demand).

## Desplegar en Vercel

1. Subí el proyecto a GitHub (ya está en
   [github.com/lucasgonzalezsilvaa-sudo/mochi](https://github.com/lucasgonzalezsilvaa-sudo/mochi)).
2. Importalo en [vercel.com/new](https://vercel.com/new) (detecta Next.js solo).
3. En **Settings → Environment Variables**, cargá las mismas tres variables del
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD`).
4. **Deploy.** El admin ya funciona online: crear/editar/borrar persiste en Supabase.

## Arquitectura

```
supabase/schema.sql       Tablas (notas, viajes) + bucket de imágenes
scripts/seed-supabase.mjs Importa content/ → Supabase (npm run seed)
src/lib/supabase.ts       Cliente admin (service role, solo servidor)
src/lib/notas.ts          CRUD de notas sobre Supabase
src/lib/viajes.ts         CRUD de viajes + reseñas sobre Supabase
src/app/(site)/           Landing + blog + páginas de viajes (SSR dinámico)
src/app/admin/            Panel de administración (login por cookie)
src/app/api/              API de notas, viajes, upload y sesión
content/                  Contenido de ejemplo (semilla del seed)
```

Páginas de contenido con render dinámico (SSR) para reflejar ediciones al instante y
seguir siendo indexables (SEO). Sitemap y robots incluidos.

## Diseño

Animaciones basadas en la filosofía de Emil Kowalski: curvas de easing fuertes
(`cubic-bezier(0.23, 1, 0.32, 1)`), solo `transform` + `opacity`, feedback al presionar
y respeto por `prefers-reduced-motion`.
