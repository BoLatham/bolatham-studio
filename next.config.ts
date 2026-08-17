import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The site is entirely static: every route is prerendered at build time and
   * nothing needs a server at request time. Exporting to plain files lets it be
   * hosted anywhere, which is what makes Cloudflare Pages an option.
   *
   * Cache headers live in `public/_headers`, not here. Next's `headers()` config
   * only applies on a server that runs Next, and an export has none.
   */
  output: "export",

  images: {
    /**
     * Required by `output: export`, which has no server to resize on request.
     * Costs little here because the masters in `ASSETS/` are already cut to the
     * exact ratios the layouts use.
     */
    unoptimized: true,
  },
};

export default nextConfig;
