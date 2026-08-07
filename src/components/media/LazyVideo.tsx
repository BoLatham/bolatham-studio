"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  poster: string;
  className?: string;
  /** Accessible description. Videos are decorative loops, so this is a label. */
  label?: string;
}

/**
 * Muted looping video that only plays while on screen.
 *
 * The mockups set `autoplay` on every clip, which is fine for a local preview
 * and not acceptable in production: the Video filter alone would start eight
 * concurrent streams on load. Here nothing is fetched until the element nears
 * the viewport (`preload="none"` plus the poster), playback starts when it is
 * visible, and pauses when it leaves.
 *
 * Honours prefers-reduced-motion by staying on the poster frame.
 */
export default function LazyVideo({ src, poster, className, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks autoplay. The poster stays up,
          // which is a perfectly acceptable fallback.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
