"use client";

import { useRef, useState } from "react";

export default function ImageGallery({
  value,
  onChange,
  presets,
}: {
  value: string[];
  onChange: (images: string[]) => void;
  presets: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) uploaded.push(data.path);
        else setError(data.error ?? "No se pudo subir una imagen.");
      }
      if (uploaded.length) onChange([...value, ...uploaded]);
    } catch {
      setError("Error de conexión.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addPreset(src: string) {
    if (!value.includes(src)) onChange([...value, src]);
  }

  return (
    <div>
      {/* Imágenes actuales (ordenadas) */}
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {value.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative w-28 overflow-hidden rounded-lg border border-line bg-cream"
            >
              <div className="relative aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-terra px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    Portada
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs text-white hover:bg-terra-deep"
                  aria-label="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="px-1.5 text-ink-soft disabled:opacity-30 hover:text-terra"
                  aria-label="Mover a la izquierda"
                >
                  ←
                </button>
                <span className="text-[10px] text-muted">{i + 1}</span>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="px-1.5 text-ink-soft disabled:opacity-30 hover:text-terra"
                  aria-label="Mover a la derecha"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-soft">
          Todavía no hay imágenes. Subí una o elegí de las de abajo.
        </p>
      )}

      {/* Agregar: subir o presets */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-ink-soft transition-colors hover:border-terra hover:text-terra ${
            uploading ? "opacity-60" : ""
          }`}
        >
          {uploading ? "Subiendo…" : "＋ Subir imagen"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFiles}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {presets.map((src) => (
          <button
            type="button"
            key={src}
            onClick={() => addPreset(src)}
            className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-md border-2 border-transparent transition-colors hover:border-terra"
            aria-label={`Agregar ${src}`}
            title="Agregar a la galería"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {error && <p className="mt-1.5 text-xs text-terra-deep">{error}</p>}
    </div>
  );
}
