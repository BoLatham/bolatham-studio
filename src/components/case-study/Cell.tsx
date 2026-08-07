import Image from "next/image";
import type { CSSProperties } from "react";
import type { Cell as CellData } from "@/data/case-studies";
import LazyVideo from "@/components/media/LazyVideo";

interface Props {
  cell: CellData;
  /** Responsive hint for next/image. Varies by row type. */
  sizes: string;
  /** Extra modifiers: cell--motion, cell--desktop-only, cell--mobile-only. */
  className?: string;
  /** Above-the-fold media skips lazy loading. */
  priority?: boolean;
  /** Carries --mobile-order for rows that reorder below 780px. */
  style?: CSSProperties;
}

/**
 * One media cell. Aspect ratio comes from the parent row's CSS via --ar, so a
 * cell never needs to know which row type it is sitting in.
 */
export default function Cell({ cell, sizes, className, priority, style }: Props) {
  const { media, tag, tagPlacement = "flow", stat } = cell;

  const classes = ["cell", stat ? "cell--stat" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {media.kind === "image" ? (
        <Image
          className="cell__media"
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
        />
      ) : (
        <LazyVideo
          className="cell__media"
          src={media.src}
          poster={media.poster}
          label={media.alt}
        />
      )}

      {/* Scrim only where text sits over the image. */}
      {stat && <div className="cell__scrim" aria-hidden="true" />}

      {tag && (
        <span
          className={
            tagPlacement === "corner" ? "cell__tag cell__tag--corner" : "cell__tag"
          }
        >
          {tag}
        </span>
      )}

      {stat && (
        <>
          <span className="stat-number">{stat.number}</span>
          <span className="stat-sub">{stat.sub}</span>
        </>
      )}
    </div>
  );
}
