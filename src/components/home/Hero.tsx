"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { GESTURES, markMuted } from "@/components/media/autoplay";

const MOBILE_QUERY = "(max-width: 780px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () =>
  window.matchMedia(MOBILE_QUERY).matches ? "mobile" : "desktop";

/** No video in the server HTML; the client resolves which one to fetch. */
const getServerSnapshot = () => null;

/**
 * Keeps the hero clip running, which the autoplay attribute alone does not
 * achieve on a phone. Three things get in the way, and the poster frame is all
 * that shows when they do:
 *
 * 1. React assigns muted as a DOM property, so no muted attribute ever reaches
 *    the element. WebKit reads the attribute when it decides whether a video
 *    may start on its own, so a video React built looks unmuted to the policy
 *    and is refused. Writing the attribute is what makes it eligible.
 * 2. iOS Low Power Mode and Android battery saver refuse every autoplay
 *    whatever the attributes say. A single user gesture lifts that for the
 *    page, so the first touch, tap, key or scroll retries.
 * 3. A clip that was never allowed to start is still paused when the tab
 *    returns to the foreground, so visibility changes retry too.
 *
 * Each attempt is a no-op while the video is already running, and a rejected
 * play() leaves the poster up, which is the same fallback as before.
 */
function useBackgroundPlayback(variant: "mobile" | "desktop" | null) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    markMuted(el);

    const attempt = () => {
      if (!el.paused) return;
      void el.play().catch(() => {});
    };

    el.addEventListener("loadeddata", attempt);
    el.addEventListener("canplay", attempt);
    document.addEventListener("visibilitychange", attempt);
    for (const event of GESTURES) {
      window.addEventListener(event, attempt, { passive: true });
    }

    // The element may already hold enough data to start, in which case none of
    // those events is still coming.
    attempt();

    return () => {
      el.removeEventListener("loadeddata", attempt);
      el.removeEventListener("canplay", attempt);
      document.removeEventListener("visibilitychange", attempt);
      for (const event of GESTURES) {
        window.removeEventListener(event, attempt);
      }
    };
  }, [variant]);

  return ref;
}

/**
 * Hero with separate desktop and mobile video sources.
 *
 * The mockup ships both <video> elements and hides one with CSS. That would
 * pull roughly 21 MB on every visit to display 12 MB of it, because
 * display: none does not reliably stop a video from loading. Here exactly one
 * file is ever requested.
 *
 * The poster is chosen by <picture>, which honours source media queries
 * natively (unlike <video>, where the media attribute is ignored). So the
 * correct still paints on the first frame with no JavaScript and no flash,
 * and the video fades in over it. That also keeps the largest contentful
 * paint on a small image rather than a video stream.
 */
export default function Hero() {
  const variant = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const videoRef = useBackgroundPlayback(variant);

  return (
    <section className="hero">
      <div className="hero__media" id="heroMedia">
        <picture>
          <source
            media={MOBILE_QUERY}
            srcSet="/home/hero/hero-mobile-poster.jpg"
          />
          <img
            className="hero__video"
            src="/home/hero/hero-desktop-poster.jpg"
            alt=""
            aria-hidden="true"
          />
        </picture>

        {variant && (
          <video
            ref={videoRef}
            className="hero__video"
            src={`/home/hero/hero-${variant}.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        )}

        <div className="hero__scrim" />

        <div className="hero__content">
          <h1 className="hero__headline">
            <span className="red">Scroll-stopping</span> content
            <br />
            and culture-first <span className="red">creative.</span>
          </h1>
          <p className="hero__bio">
            Full-service production with 20+ years of leading branded campaigns,
            content strategy, and digital storytelling across music, sports, and
            culture-driven spaces. Known for{" "}
            <span className="bio-emphasis">
              translating brand vision into high-impact content
            </span>{" "}
            that performs across platforms and mobilizes passionate communities
            and fans.
          </p>
        </div>

        <div className="hero__fade" />
      </div>
    </section>
  );
}
