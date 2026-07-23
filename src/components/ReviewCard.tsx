import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/lib/viajes-shared";

export default function ReviewCard({
  review,
  tourName,
  tourSlug,
}: {
  review: Review;
  tourName?: string;
  tourSlug?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-cream p-6">
      <p className="flex-1 text-ink-soft italic leading-relaxed">“{review.opinion}”</p>
      <div className="mt-5 flex items-center gap-3">
        {review.photo && (
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <Image src={review.photo} alt={review.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-ink">{review.name}</p>
          {tourName &&
            (tourSlug ? (
              <Link
                href={`/viajes/${tourSlug}`}
                className="text-xs text-terra hover:underline"
              >
                {tourName}
              </Link>
            ) : (
              <p className="text-xs text-muted">{tourName}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
