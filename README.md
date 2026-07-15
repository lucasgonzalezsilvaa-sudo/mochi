# Los Viajes de Mochi

Landing + blog para Mochi, viajera que organiza viajes en grupos reducidos por
Sudamérica. Rediseño de [mochiviaja.com](https://mochiviaja.com) con panel de
administración para publicar notas (posts) y posicionarse en Google.

Hecho con **Next.js 16 + Tailwind CSS 4**. Las notas se guardan como archivos
Markdown en el repo (sin base de datos), así cada nota es una página estática que
Google indexa.

## Correr en local

```bash
npm install
npm run dev
```

- Sitio: http://localhost:3000
- Panel admin: http://localhost:3000/admin

## Entrar al panel (login)

El panel `/admin` está protegido con contraseña (cookie de sesión, funciona también
en Vercel).

- **Contraseña por defecto:** `mochi2026`
- Se cambia en [`src/lib/auth.ts`](src/lib/auth.ts) o con la variable de entorno
  `ADMIN_PASSWORD` en Vercel.
- Al entrar a `/admin` sin sesión, redirige a `/admin/login`. Hay botón de
  "Cerrar sesión" dentro del panel.

## Escribir notas

1. Entrá a `/admin` en tu computadora e iniciá sesión.
2. Completá título, resumen, portada y contenido (en Markdown) y publicá.
3. Cada nota se guarda como un archivo en `content/notas/`.
4. Para que aparezca online, subí los cambios a Git → Vercel republica solo.

> El panel escribe archivos en tu disco, por eso funciona **en local**. En Vercel
> el sistema de archivos es de solo lectura: el flujo es escribir local → push →
> deploy. Es lo ideal para SEO, porque genera páginas estáticas.

También podés crear/editar notas a mano en `content/notas/*.md`. Formato:

```markdown
---
title: Título de la nota
excerpt: Frase corta para tarjetas y Google
date: "2026-07-10"
cover: /images/hero-atacama.jpg
tags: [uruguay, consejos]
author: Mochi
---

Cuerpo en **Markdown**...
```

## Estructura

```
content/notas/        Notas en Markdown (el "CMS")
public/images/        Imágenes del sitio original, reutilizadas
src/app/(site)/       Landing + blog (con Header/Footer)
src/app/admin/        Panel de administración
src/app/api/notas/    API que guarda/borra notas en disco
src/lib/site.ts       Datos de marca, redes y viajes
src/lib/notas.ts      Lectura/escritura de notas
```

## Editar los viajes y datos de contacto

Los tres viajes destacados y los datos de contacto (WhatsApp, Instagram, mail)
están en [`src/lib/site.ts`](src/lib/site.ts).

## Desplegar en Vercel

1. Subí el proyecto a un repo de GitHub (`git init`, commit y push).
2. Importalo en [vercel.com](https://vercel.com) — detecta Next.js automáticamente.
3. (Opcional) Definí la variable de entorno `ADMIN_KEY` para proteger la API si
   alguna vez habilitás escritura remota.

## Diseño

Animaciones basadas en la filosofía de Emil Kowalski (skills instaladas):
curvas de easing fuertes (`cubic-bezier(0.23, 1, 0.32, 1)`), solo `transform` +
`opacity`, feedback al presionar botones, y respeto por `prefers-reduced-motion`.
