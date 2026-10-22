"use client";

import { useEffect, useRef } from "react";
import { GESTURES, markMuted } from "./autoplay";

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

    markMuted(el);

    let visible = false;

    const attempt = () => {
      // Nothing to do when it is off screen or already running. A rejected
      // play() leaves the poster up, which is an acceptable fallback.
      if (!visible || !el.paused) return;
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) attempt();
        else el.pause();
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    /* preload="none" means that first attempt runs at readyState 0, with no
       data and the request only just sent. play() can lose that race and
       reject, and because the clip is already in view no further intersection
       is coming, so a single attempt left it on its poster for good. Switching
       the filter and back was what appeared to fix it: the component remounts,
       the file is in the cache by then, and play() wins. These two events are
       the retry that makes the first appearance behave like the second. */
    el.addEventListener("loadeddata", attempt);
    el.addEventListener("canplay", attempt);
    for (const event of GESTURES) {
      window.addEventListener(event, attempt, { passive: true });
    }

    return () => {
      observer.disconnect();
      el.removeEventListener("loadeddata", attempt);
      el.removeEventListener("canplay", attempt);
      for (const event of GESTURES) {
        window.removeEventListener(event, attempt);
      }
    };
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
