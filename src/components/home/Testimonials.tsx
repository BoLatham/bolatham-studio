"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ROTATING_WORDS, ROTATION_REFERENCE, TESTIMONIALS } from "@/data/home";

const INTERVAL = 2200;
const SWAP = 400;

/**
 * Testimonials, with a word that rotates in the headline.
 *
 * The headline's width is pinned to the rendered width of the longest phrase,
 * measured in the actual loaded font rather than guessed in ch units. Without
 * that, every swap to a shorter word would shift the whole line.
 */
export default function Testimonials() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [index, setIndex] = useState(ROTATING_WORDS.length - 1);
  const [swapping, setSwapping] = useState(false);

  // Anchor the headline width once fonts are ready, and again on resize.
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    function measure() {
      if (!title) return;
      if (window.innerWidth <= 480) {
        title.style.width = "";
        return;
      }
      const probe = document.createElement("span");
      probe.style.visibility = "hidden";
      probe.style.position = "absolute";
      probe.style.whiteSpace = "nowrap";
      probe.style.font = window.getComputedStyle(title).font;
      probe.textContent = ROTATION_REFERENCE;
      document.body.appendChild(probe);
      title.style.width = `${probe.offsetWidth}px`;
      probe.remove();
    }

    if (document.fonts?.ready) {
      void document.fonts.ready.then(measure);
    } else {
      measure();
    }

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setSwapping(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setSwapping(false);
      }, SWAP);
    }, INTERVAL);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="section testimonials">
      <h2 className="rotating-title" ref={titleRef}>
        Trusted by:{" "}
        <span className={`rotate-word${swapping ? " is-swapping" : ""}`}>
          {ROTATING_WORDS[index]}
        </span>
      </h2>

      <div className="testimonials__grid">
        {TESTIMONIALS.map((t) => (
          <figure className="testimonial" key={t.name}>
            <div className="stars" aria-label="Five out of five">
              ★★★★★
            </div>
            <blockquote className="quote">{t.quote}</blockquote>
            <figcaption className="attribution">
              <div className="attribution__top">
                <span>{t.name}</span>
                <div className="testimonial__logo">
                  <Image src={t.logo} alt={t.company} fill sizes="76px" />
                </div>
              </div>
              <span>{t.company}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
