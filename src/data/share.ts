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
 * Restating openGraph on a child route drops the file-convention og:image with
 * it, not only the fields named in the override, and restating twitter drops
 * the card type down to a plain summary. Neither failure shows up unless the
 * rendered tags are read back, so any route that overrides either object has to
 * name the image itself. The root layout is the one place that can still leave
 * it to app/opengraph-image.png.
 */
export const shareImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "The BL monogram of Bo Latham, cream script initials on a red disc.",
};

/**
 * There is deliberately no og:video here.
 *
 * A preview carrying og:video is a video player in Messages, not a picture that
 * happens to move: the video surface owns the tap and opens system playback.
 * Open Graph exposes nothing to animate the card while still sending the tap to
 * the URL, so the looping clip cost the click that sharing the link exists to
 * earn. Dropped 2026-08-11 at Bo's call, in favour of the still, which taps
 * straight through to the site.
 *
 * The master is still in ASSETS/HOME/PERSONAL BRAND LOGO/ if this is ever
 * revisited, and build-media.sh records the encode it used.
 */
