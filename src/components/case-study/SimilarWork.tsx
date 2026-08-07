import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/data/case-studies";

/**
 * Cross-link to the other case study.
 *
 * The grid is repeat(3, 1fr) holding a single card, so the card sits at a third
 * width. That is deliberate from the mockups, not an unfinished row.
 */
export default function SimilarWork({
  study,
  thumb,
}: {
  study: CaseStudy;
  thumb: string;
}) {
  return (
    <section className="similar">
      <div className="similar__head">
        <h2>Similar Work</h2>
      </div>
      <div className="similar__grid">
        <Link className="similar__card" href={`/case-studies/${study.slug}`}>
          <div className="cell">
            <Image
              className="cell__media"
              src={thumb}
              alt={study.title}
              fill
              sizes="(max-width: 780px) 100vw, 33vw"
            />
          </div>
          <h3>{study.title}</h3>
          <p>{study.client}</p>
        </Link>
      </div>
    </section>
  );
}
