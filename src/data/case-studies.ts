/**
 * Case study content model.
 *
 * Pages are composed from an ordered list of typed rows. Adding a new case
 * study means adding an entry here, never writing a new page component. The
 * five empty folders in ASSETS/CASE STUDIES (Creek Water, P3, Recordbook,
 * Sweet Cream, Wild Card) are why this is data-driven from day one.
 */

export type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string; poster: string };

export interface Stat {
  number: string;
  sub: string;
}

export interface Cell {
  media: Media;
  /** Small pill label over the media. */
  tag?: string;
  /**
   * Where the pill sits. "flow" puts it in the cell's normal flex flow, which
   * for stat cells means top-left. "corner" pins it bottom-right.
   * Pit Crew Chronicles uses flow; Las Vegas Grand Prix uses corner.
   */
  tagPlacement?: "flow" | "corner";
  stat?: Stat;
  /** Triptych centre cell only: scale(1.04) plus a drop shadow. */
  motion?: boolean;
}

export type Row =
  | { type: "text"; eyebrow: string; headline: string; body: string }
  | {
      type: "triptych";
      cells: [Cell, Cell, Cell];
      /**
       * Per-cell CSS `order` below 780px. Desktop order is never touched.
       * Omit for natural DOM order.
       */
      mobileOrder?: [number, number, number];
      spaced?: boolean;
    }
  | { type: "full"; desktop: Cell; mobile: Cell; spaced?: boolean }
  | { type: "pair"; cells: [Cell, Cell] }
  | { type: "stat-pair"; cells: [Cell, Cell] }
  | { type: "trio"; cells: [Cell, Cell, Cell] };

export interface CaseStudy {
  slug: string;
  /** Rendered as "Case Study — 01 / 02". */
  index: number;
  title: string;
  client: string;
  category: string;
  /** Thumbnail of the OTHER study, shown in this one's Similar Work footer. */
  similarWorkThumb: string;
  rows: Row[];
}

const PCC = "/case-studies/pit-crew-chronicles";
const LVGP = "/case-studies/las-vegas-grand-prix";

const pitCrewChronicles: CaseStudy = {
  slug: "pit-crew-chronicles",
  index: 1,
  title: "Pit Crew Chronicles",
  client: "Red Bull Racing (Formula 1)",
  category: "Content Strategy, Direction, Cinematography & Edit",
  similarWorkThumb: `${PCC}/similar-work.webp`,
  rows: [
    {
      type: "text",
      eyebrow: "The Setup",
      headline: "America's Team, One TikTok at a time.",
      body: "Formula 1 was a niche sport in America. Five episodes, five worlds, one pit crew. Built to turn casual fans into F1 fans, one platform-native story at a time.",
    },
    {
      type: "triptych",
      // Mobile runs static2, video, static1. Deliberate, and the only reorder
      // in either study.
      mobileOrder: [2, 1, 0],
      spaced: true,
      cells: [
        {
          media: { kind: "image", src: `${PCC}/triptych-bucks-1.webp`, alt: "Bucks halftime" },
          tag: "Bucks halftime",
        },
        {
          media: {
            kind: "video",
            src: `${PCC}/triptych-bucks-2.mp4`,
            alt: "Bucks halftime",
            poster: `${PCC}/triptych-bucks-2-poster.jpg`,
          },
          tag: "Bucks halftime",
          motion: true,
        },
        {
          media: { kind: "image", src: `${PCC}/triptych-bucks-3.webp`, alt: "Bucks halftime" },
          tag: "Bucks halftime",
        },
      ],
    },
    {
      type: "full",
      spaced: true,
      desktop: {
        media: {
          kind: "image",
          src: `${PCC}/stat-overlay-desktop.webp`,
          alt: "BLXST, Red Bull Records HQ",
        },
        tag: "BLXST, Red Bull Records HQ",
        stat: { number: "700K views", sub: "vs. 200K benchmark" },
      },
      mobile: {
        media: {
          kind: "image",
          src: `${PCC}/stat-overlay-mobile.webp`,
          alt: "BLXST, Red Bull Records HQ",
        },
        tag: "BLXST, Red Bull Records HQ",
        stat: { number: "700K views", sub: "vs. 200K benchmark" },
      },
    },
    {
      type: "triptych",
      cells: [
        {
          media: { kind: "image", src: `${PCC}/triptych-blxst-1.webp`, alt: "BLXST, Red Bull Records HQ" },
          tag: "BLXST, Red Bull Records HQ",
        },
        {
          media: {
            kind: "video",
            src: `${PCC}/triptych-blxst-2.mp4`,
            alt: "BLXST, Red Bull Records HQ",
            poster: `${PCC}/triptych-blxst-2-poster.jpg`,
          },
          tag: "BLXST, Red Bull Records HQ",
          motion: true,
        },
        {
          media: { kind: "image", src: `${PCC}/triptych-blxst-3.webp`, alt: "BLXST, Red Bull Records HQ" },
          tag: "BLXST, Red Bull Records HQ",
        },
      ],
    },
    {
      type: "text",
      eyebrow: "The Scope",
      headline: "Five worlds. One pit crew.",
      body: "NBA courts, skate parks, recording studios, gaming arenas, an MLS pitch. Same team, five different cultures, zero compromise on who they are.",
    },
    {
      type: "triptych",
      spaced: true,
      cells: [
        {
          media: { kind: "image", src: `${PCC}/triptych-soccer-1.webp`, alt: "Soccer, NY Red Bulls" },
          tag: "Soccer, NY Red Bulls",
        },
        {
          media: {
            kind: "video",
            src: `${PCC}/triptych-soccer-2.mp4`,
            alt: "Soccer, NY Red Bulls",
            poster: `${PCC}/triptych-soccer-2-poster.jpg`,
          },
          tag: "Soccer, NY Red Bulls",
          motion: true,
        },
        {
          media: { kind: "image", src: `${PCC}/triptych-soccer-3.webp`, alt: "Soccer, NY Red Bulls" },
          tag: "Soccer, NY Red Bulls",
        },
      ],
    },
    {
      type: "stat-pair",
      cells: [
        {
          media: { kind: "image", src: `${PCC}/pair-venice.webp`, alt: "Venice Skatepark" },
          tag: "Venice Skatepark",
          tagPlacement: "flow",
          stat: { number: "12%", sub: "engagement vs. 3.5% industry benchmark" },
        },
        {
          media: { kind: "image", src: `${PCC}/pair-gaming.webp`, alt: "Gaming Center" },
          tag: "Gaming Center",
          tagPlacement: "flow",
          stat: { number: "+47%", sub: "YoY audience growth" },
        },
      ],
    },
    {
      type: "text",
      eyebrow: "The Impact",
      headline: "From pit lane to pop culture.",
      body: "The series didn't just perform. It repositioned Red Bull Racing as an American lifestyle brand, not just a racing team, and set the stage for what came next.",
    },
    {
      type: "trio",
      cells: [
        {
          media: { kind: "image", src: `${PCC}/trio-1-red-bulls.webp`, alt: "BTS — NY Red Bulls" },
          tag: "BTS — NY Red Bulls",
        },
        {
          media: { kind: "image", src: `${PCC}/trio-2-bucks.webp`, alt: "BTS — Bucks" },
          tag: "BTS — Bucks",
        },
        {
          media: { kind: "image", src: `${PCC}/trio-3-venice.webp`, alt: "BTS — Venice Skatepark" },
          tag: "BTS — Venice Skatepark",
        },
      ],
    },
  ],
};

const lasVegasGrandPrix: CaseStudy = {
  slug: "las-vegas-grand-prix",
  index: 2,
  title: "Las Vegas Grand Prix",
  client: "Blue Man Group × Red Bull Racing",
  category: "Creative Direction, Cinematography, Sound Design & Edit",
  similarWorkThumb: `${LVGP}/similar-work.webp`,
  rows: [
    {
      type: "text",
      eyebrow: "The Setup",
      headline: "Percussion meets precision at speed.",
      body: "The most viewed campaign in Blue Man Group history. Red Bull and Blue Man Group joined forces to promote the inaugural Las Vegas Grand Prix, built to resonate rather than just cross-promote.",
    },
    {
      type: "triptych",
      cells: [
        {
          media: { kind: "image", src: `${LVGP}/triptych-1.webp`, alt: "Drumbone Performance" },
          tag: "Drumbone Performance",
        },
        {
          media: {
            kind: "video",
            src: `${LVGP}/triptych-2.mp4`,
            alt: "Performance, Blue Man Group",
            poster: `${LVGP}/triptych-2-poster.jpg`,
          },
          tag: "Performance — Blue Man Group",
          motion: true,
        },
        {
          media: { kind: "image", src: `${LVGP}/triptych-3.webp`, alt: "ASMR Performance" },
          tag: "ASMR Performance",
        },
      ],
    },
    {
      type: "full",
      desktop: {
        media: { kind: "image", src: `${LVGP}/stat-overlay-desktop.webp`, alt: "Blue Man Group" },
        tag: "Blue Man Group",
        stat: { number: "200M+ Views", sub: "Most viewed video in Blue Man Group history" },
      },
      mobile: {
        media: { kind: "image", src: `${LVGP}/stat-overlay-mobile.webp`, alt: "Blue Man Group" },
        tag: "Blue Man Group",
        stat: { number: "200M+ Views", sub: "Most viewed video in Blue Man Group history" },
      },
    },
    {
      type: "stat-pair",
      cells: [
        {
          media: { kind: "image", src: `${LVGP}/stat-pair-1.webp`, alt: "Drumbone Performance" },
          tag: "Drumbone Performance",
          tagPlacement: "corner",
          stat: { number: "125M+", sub: "Iconic Drumbone Performance" },
        },
        {
          media: { kind: "image", src: `${LVGP}/stat-pair-2.webp`, alt: "ASMR Drumming Performance" },
          tag: "ASMR Drumming Performance",
          tagPlacement: "corner",
          stat: { number: "75M+", sub: "ASMR Drumming Performance" },
        },
      ],
    },
    {
      type: "text",
      eyebrow: "The Impact",
      headline: "Outperformed entertainment itself.",
      body: "Two iconic brands, one unmistakable moment. The campaign introduced Blue Man Group to a generation that had never seen them before, and proved a 30-year-old live act can still win the internet when the idea is right.",
    },
    {
      type: "stat-pair",
      cells: [
        {
          media: { kind: "image", src: `${LVGP}/on-set-pair-1.webp`, alt: "On set" },
          tag: "On set",
          tagPlacement: "corner",
          stat: { number: "400%+", sub: "Highest performing BMG campaign ever" },
        },
        {
          media: { kind: "image", src: `${LVGP}/on-set-pair-2.webp`, alt: "On set" },
          tag: "On set",
          tagPlacement: "corner",
          stat: { number: "5M+", sub: "New accounts reached in 48 hours" },
        },
      ],
    },
    {
      type: "trio",
      cells: [
        {
          media: { kind: "image", src: `${LVGP}/trio-1.webp`, alt: "BTS — Blue Man Group" },
          tag: "BTS — Blue Man Group",
        },
        {
          media: {
            kind: "video",
            src: `${LVGP}/trio-2.mp4`,
            alt: "BTS — Blue Man Group",
            poster: `${LVGP}/trio-2-poster.jpg`,
          },
          tag: "BTS — Blue Man Group",
        },
        {
          media: { kind: "image", src: `${LVGP}/trio-3.webp`, alt: "BTS — Blue Man Group" },
          tag: "BTS — Blue Man Group",
        },
      ],
    },
  ],
};

export const caseStudies: CaseStudy[] = [pitCrewChronicles, lasVegasGrandPrix];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** The other study, for the Similar Work footer. */
export function getSimilarWork(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug !== slug);
}
