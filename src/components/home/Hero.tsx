"use client";

import { useSyncExternalStore } from "react";

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
