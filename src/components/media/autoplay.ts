/**
 * Shared pieces for getting a muted video to actually start on its own.
 *
 * Two things stop one, and neither is visible from the markup:
 *
 * React assigns muted as a DOM property. On a video it builds client side no
 * muted attribute reaches the element, and WebKit reads the attribute when it
 * decides whether a video may play unprompted, so the video looks unmuted to
 * the policy and play() is refused. A video that was server rendered already
 * carries the attribute from the HTML, so this only bites the client-only ones,
 * but setting it costs nothing and makes the two cases behave alike.
 *
 * iOS Low Power Mode and Android battery saver refuse every autoplay whatever
 * the attributes say. Only a user gesture lifts that, so a refused start is
 * worth retrying after one.
 */

/** Marks a video muted the way the autoplay policy actually checks. */
export function markMuted(el: HTMLVideoElement) {
  el.defaultMuted = true;
  el.muted = true;
  el.setAttribute("muted", "");
}

/** Events after which a refused autoplay is worth attempting again. */
export const GESTURES = [
  "pointerdown",
  "touchstart",
  "touchend",
  "click",
  "keydown",
  "scroll",
] as const;
