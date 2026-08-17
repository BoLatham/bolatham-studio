import type { NextConfig } from "next";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Media in `public/` is immutable in practice: `scripts/build-media.sh` always
 * encodes from the masters in `ASSETS/` to a fixed filename, so a given path
 * keeps serving the same bytes until that file is deliberately re-cut.
 *
 * Vercel serves `public/` with `max-age=0, must-revalidate` by default, which
 * means all ~130 media files revalidate on every page view. A 304 is still a
 * billable Edge Request, and video adds several range requests per clip on top,
 * so a single visit costs hundreds of requests and a *returning* visit costs
 * nearly as many as a first one. That is what exhausted the free tier.
 *
 * Matching is by extension rather than by directory on purpose: `/case-studies`
 * is both a media folder and a real route, and freezing those HTML pages for a
 * year would make future edits invisible to anyone who has already visited.
 *
 * Tradeoff: re-cutting a clip without renaming it leaves already-cached
 * browsers on the old copy. Rename the file (or add `?v=2`) when that happens.
 */
const MEDIA = "/:path*.:ext(mp4|jpg|jpeg|png|webp|avif|svg|ico|woff2)";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: MEDIA,
        headers: [
          { key: "Cache-Control", value: `public, max-age=${YEAR}, immutable` },
        ],
      },
    ];
  },
};

export default nextConfig;
