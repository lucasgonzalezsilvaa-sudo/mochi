import Image from "next/image";
import type { Coordinator } from "@/lib/site";

export default function CoordinatorCard({ coordinator }: { coordinator: Coordinator }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-cream">
      <div className="card-media relative aspect-[4/5] overflow-hidden">
        <Image
          src={coordinator.photo}
          alt={coordinator.name}
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-ink">{coordinator.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{coordinator.bio}</p>
      </div>
    </div>
  );
}
