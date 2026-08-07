import Image from "next/image";
import Link from "next/link";
import { CASE_CARDS } from "@/data/home";

/**
 * Case study cards.
 *
 * The cards stick below the nav so each one is overlaid by the next as you
 * scroll. The mockup also faded the outgoing card out with an
 * IntersectionObserver (scale 0.96, brightness 0.7); that was dropped at Bo's
 * request on 2026-08-07 because it was never a finished idea. Removing it also
 * made this a plain server component: no state, no effects, no client JS.
 */
export default function CaseStudyStack() {
  return (
    <>
      <section className="section case-studies" id="case-studies">
        <h2 className="display-headline">
          Browse Case Studies<span className="red">:</span>
        </h2>
      </section>

      <div className="cs-stack">
        {CASE_CARDS.map((card, i) => (
          <div className="cs-card-wrap" key={card.slug}>
            <Link
              className="cs-card"
              href={`/case-studies/${card.slug}`}
              style={{ zIndex: i + 1 }}
            >
              <h3 className="cs-card__title">{card.title}</h3>
              <p className="cs-card__client">{card.client}</p>
              <p className="cs-card__body">{card.body}</p>
              <span className="cs-card__stat">{card.stat}</span>

              <div className="cs-card__thumbs">
                {card.thumbs.map((t) => (
                  <div className="cs-card__thumb" key={t.src}>
                    <Image
                      src={t.src}
                      alt={t.alt}
                      fill
                      sizes="(max-width: 780px) 30vw, 15vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
