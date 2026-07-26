"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function TourGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const n = images.length;

  if (n === 0) return null;

  const go = (dir: number) => setIndex((p) => (p + dir + n) % n);

  return (
    <div className="select-none">
      <div
        className="relative overflow-hidden rounded-3xl bg-sand-2"
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (startX.current == null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <div
          className="flex duration-500 [transition-property:transform] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div key={`${src}-${idx}`} className="relative aspect-[16/10] w-full shrink-0">
              <Image
                src={src}
                alt={`${name} — foto ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="btn absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white backdrop-blur-sm hover:bg-ink/75"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="btn absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white backdrop-blur-sm hover:bg-ink/75"
            >
              →
            </button>
            <span className="absolute right-3 top-3 rounded-full bg-ink/55 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
              {index + 1}/{n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setIndex(idx)}
              aria-label={`Ir a la foto ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === index ? "w-6 bg-terra" : "w-2 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
