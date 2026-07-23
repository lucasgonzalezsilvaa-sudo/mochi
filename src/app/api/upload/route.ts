import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La autenticación (sesión con cookie) la resuelve src/proxy.ts.

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const ext = ALLOWED_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Formato no soportado. Usá JPG, PNG, WEBP o GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen no puede superar 5MB." }, { status: 400 });
  }

  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ path: `/images/uploads/${filename}` });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          "No se pudo guardar la imagen. En un servidor sin escritura (como Vercel) esto funciona solo en tu computadora local.",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
