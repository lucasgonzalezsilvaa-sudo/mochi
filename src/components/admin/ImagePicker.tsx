"use client";

import { useRef, useState } from "react";

export default function ImagePicker({
  value,
  onChange,
  presets,
  circular = false,
}: {
  value: string;
  onChange: (path: string) => void;
  presets: string[];
  circular?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.path);
      } else {
        setError(data.error ?? "No se pudo subir la imagen.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const shape = circular ? "rounded-full" : "rounded-lg";
  const isCustom = value && !presets.includes(value);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {presets.map((src) => (
          <button
            type="button"
            key={src}
            onClick={() => onChange(src)}
            className={`relative aspect-square w-14 shrink-0 overflow-hidden ${shape} border-2 transition-colors ${
              value === src ? "border-terra" : "border-transparent"
            }`}
            aria-label={src}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        <label
          className={`relative flex aspect-square w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed text-lg transition-colors ${shape} ${
            isCustom ? "border-terra" : "border-line hover:border-terra"
          } ${uploading ? "opacity-60" : ""}`}
        >
          {uploading ? (
            <span className="text-xs text-muted">…</span>
          ) : isCustom ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted">＋</span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-terra-deep">{error}</p>}
    </div>
  );
}
