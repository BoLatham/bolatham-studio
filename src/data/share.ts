/**
 * Link preview metadata, shared by the root layout and the case study route.
 *
 * Next merges metadata shallowly, so a route that returns its own `openGraph`
 * replaces the parent's rather than extending it. Anything that must survive on
 * every page therefore has to be spread back in by hand. The og:image is the
 * exception: it comes from the app/opengraph-image.png file convention, which
 * Next injects into every route regardless.
 */

export const siteUrl = "https://bolatham.studio";

export const siteDescription =
  "LA and Nashville-based Creative Content Connoisseur and Multi-Maximum Media Machine. Full-service production across music, sports, and culture-driven spaces.";

/**
 * Apple's TN3156: when a preview finds an og:video pointing at a directly
 * downloadable, playable asset, it downloads it and plays it back on its own,
 * muted and looping. It has to be a plain progressive MP4 — an HLS stream makes
 * the viewer tap to start, and anything that needs an HTML embed will not play
 * inline at all. Dimensions match opengraph-image.png so the card does not
 * letterbox when the video takes over from the still.
 *
 * Both URLs are absolute on purpose. metadataBase resolves relative og:url and
 * og:image, but it does not touch video URLs, so a relative path here ships a
 * relative og:video that off-site scrapers cannot fetch.
 */
const shareVideoPath = "/share/og-video.mp4";

export const shareVideo = {
  url: `${siteUrl}${shareVideoPath}`,
  secureUrl: `${siteUrl}${shareVideoPath}`,
  type: "video/mp4",
  width: 1200,
  height: 630,
};
