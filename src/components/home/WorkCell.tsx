import Image from "next/image";
import { WORK_MEDIA, type WorkId } from "@/data/home";
import LazyVideo from "@/components/media/LazyVideo";

const SIZES = "(max-width: 900px) 50vw, 25vw";

/**
 * One cell in the Explore grid. Aspect ratio is passed in because it is a
 * property of the position in a given filter's layout, not of the asset.
 */
export default function WorkCell({ id, ratio }: { id: WorkId; ratio: string }) {
  const media = WORK_MEDIA[id];

  return (
    <div className="explore-cell" style={{ ["--ar" as string]: ratio }}>
      {media.kind === "image" ? (
        <Image src={media.src} alt={media.alt} fill sizes={SIZES} />
      ) : (
        <LazyVideo src={media.src} poster={media.poster!} label={media.alt} />
      )}
    </div>
  );
}
