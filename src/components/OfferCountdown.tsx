"use client";

import { useEffect, useState } from "react";

function getRemaining(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function OfferCountdown({
  endsAt,
  className = "",
  textSize = "text-xs",
}: {
  endsAt: string;
  className?: string;
  textSize?: string;
}) {
  const target = new Date(endsAt).getTime();
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- primer tick inmediato, el resto llega por setInterval
    setRemaining(getRemaining(target));
    const id = setInterval(() => {
      setRemaining(getRemaining(target));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (Number.isNaN(target) || !remaining) return null;

  const { days, hours, minutes, seconds } = remaining;

  return (
    <div className={`flex items-center gap-1.5 font-medium ${textSize} ${className}`}>
      <span aria-hidden>⏳</span>
      <span>
        Oferta termina en{" "}
        {days > 0 && `${days}d `}
        {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m{" "}
        {String(seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}
