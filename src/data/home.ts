/**
 * Home page content.
 *
 * Work media is a manifest keyed by asset id. The filters reference ids, never
 * paths, because seven clips are byte-identical between the All and Video
 * filters (Bo Reel, RBR BLXST, RBR Bucks, Creek Water, Rowdy, Sweet Cream,
 * Human To Love). Shipping them once saves ~50 MB.
 */

export interface WorkMedia {
  kind: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
}

const W = "/home/work";

const img = (file: string, alt: string): WorkMedia => ({
  kind: "image",
  src: `${W}/${file}.webp`,
  alt,
});

const vid = (file: string, alt: string): WorkMedia => ({
  kind: "video",
  src: `${W}/${file}.mp4`,
  poster: `${W}/${file}-poster.jpg`,
  alt,
});

export const WORK_MEDIA = {
  // Shared between All and Video
  "bo-reel": vid("bo-reel", "Bo Reel"),
  "rbr-blxst": vid("rbr-blxst", "RBR BLXST"),
  "rbr-bucks": vid("rbr-bucks", "RBR Bucks"),
  "creek-water": vid("creek-water", "Creek Water Whiskey"),
  rowdy: vid("rowdy", "Rowdy"),
  "sweet-cream": vid("sweet-cream", "Sweet Cream"),
  "human-to-love": vid("human-to-love", "Human To Love"),

  // All only
  "artist-rollout": img("artist-rollout", "Artist Rollout"),
  "dead-on-this-hill": img("dead-on-this-hill", "Dead On This Hill"),
  "cover-art": img("cover-art", "Cover Art"),
  "wild-card-talent": img("wild-card-talent", "Wild Card Talent"),
  "sweet-cream-vertical": vid("sweet-cream-vertical", "Sweet Cream Vertical"),
  "doth-book": img("doth-book", "Dead On This Hill Book"),
  "doth-shoot": img("doth-shoot", "Dead On This Hill Shoot"),
  "get-maine-lobster": img("get-maine-lobster", "Get Maine Lobster"),
  "sweet-cream-square": img("sweet-cream-square", "Sweet Cream Square"),

  // Video only
  "rbr-bmg": vid("rbr-bmg", "RBR BMG"),
  cookup: vid("cookup", "Cookup"),
  "levi-faith": vid("levi-faith", "Levi Faith"),
  "rusty-shipp": vid("rusty-shipp", "Rusty Shipp"),
  moonride: vid("moonride", "Moonride"),
  "levi-three-words": vid("levi-three-words", "Levi Three Words"),
  scalability: vid("scalability", "Scalability"),
  "wilder-fury": vid("wilder-fury", "Wilder Fury"),
  wedding: vid("wedding", "Wedding"),

  // Design
  "design-rjc": img("design-rjc", "RJC"),
  "design-b2dw": img("design-b2dw", "B2DW"),
  "design-dom": img("design-dom", "DOM"),
  "design-wade": img("design-wade", "WADE"),
  "design-doth": vid("design-doth", "Dead On This Hill"),
  "design-wct": img("design-wct", "Wild Card Talent"),
  "design-sc-still": img("design-sc-still", "Sweet Cream"),
  "design-sc-video": vid("design-sc-video", "Sweet Cream"),
  "design-so1": img("design-so1", "Social Output 1"),
  "design-so2": img("design-so2", "Social Output 2"),
  "design-so3": img("design-so3", "Social Output 3"),
  "design-so4": img("design-so4", "Social Output 4"),
  "design-so5": img("design-so5", "Social Output 5"),
  "design-so6": img("design-so6", "Social Output 6"),
  "design-al1": img("design-al1", "AL1"),
  "design-al2": img("design-al2", "AL2"),

  // Social & Web
  "social-gml": vid("social-gml", "Get Maine Lobster"),
  "social-wct": vid("social-wct", "Wild Card Talent"),
  "social-oakla": vid("social-oakla", "Oakla Canine"),
  "social-wilchers": vid("social-wilchers", "Wilchers Landscaping"),
} as const;

export type WorkId = keyof typeof WORK_MEDIA;

export type FilterId = "all" | "design" | "video" | "social-web";

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "design", label: "Design" },
  { id: "video", label: "Video" },
  { id: "social-web", label: "Social & Web" },
];

/* ---------------------------------------------------------------------------
   Ordering and aspect ratios, taken position-for-position from the mockup.
   Index order matters: it is what makes the columns fill correctly.
   --------------------------------------------------------------------------- */

export const ALL_IDS: WorkId[] = [
  "bo-reel", "rbr-blxst", "artist-rollout", "dead-on-this-hill",
  "cover-art", "wild-card-talent", "sweet-cream-vertical", "rowdy",
  "doth-book", "doth-shoot", "human-to-love", "rbr-bucks",
  "sweet-cream", "creek-water", "get-maine-lobster", "sweet-cream-square",
];

export const ALL_RATIOS = [
  "16/9", "9/16", "1/1", "3/4", "1/1", "3/4", "9/16", "16/9",
  "3/4", "1/1", "16/9", "9/16", "9/16", "16/9", "3/4", "1/1",
];

export const DESIGN_IDS: WorkId[] = [
  "design-rjc", "design-b2dw", "design-dom", "design-wade",
  "design-doth", "design-wct", "design-sc-still", "design-sc-video",
  "design-so1", "design-so2", "design-so3", "design-so4",
  "design-so5", "design-so6", "design-al1", "design-al2",
];

/** Row of 4 squares, then a row of 4 at 3:4. */
export const DESIGN_RATIOS_INITIAL = ["1/1", "1/1", "1/1", "1/1", "3/4", "3/4", "3/4", "3/4"];
/** Four columns of 2 stacked cells. */
export const DESIGN_RATIOS_MORE = ["1/1", "3/4", "1/1", "1/1", "1/1", "1/1", "1/1", "3/4"];

export const VIDEO_IDS: WorkId[] = [
  "bo-reel", "rbr-blxst", "rbr-bucks", "creek-water",
  "rowdy", "rbr-bmg", "sweet-cream", "human-to-love",
  "cookup", "levi-faith", "rusty-shipp", "moonride",
  "levi-three-words", "scalability", "wilder-fury", "wedding",
];

/** Mixed orientation by position. */
export const VIDEO_RATIOS_INITIAL = ["16/9", "9/16", "9/16", "16/9", "16/9", "9/16", "9/16", "16/9"];
/** Uniform, so it reads as two more rows of four. */
export const VIDEO_RATIOS_MORE = ["16/9", "16/9", "16/9", "16/9", "16/9", "16/9", "16/9", "16/9"];

export const SOCIAL_IDS: WorkId[] = [
  "social-gml", "social-wct", "social-oakla", "social-wilchers",
];

/** Native ratio of the source clips. One row, no masonry. */
export const SOCIAL_RATIO = "1920/968";

/* ---------------------------------------------------------------------------
   Logo marquee. Per-logo heights come from the mockup's inline --h / --hm,
   which compensate for wildly different lockup proportions: F1 and Universal
   are thin wordmarks that need far more height to read at the same weight.
   --------------------------------------------------------------------------- */

export interface MarqueeLogo {
  src: string;
  alt: string;
  /** Rendered height, desktop and mobile. */
  h: number;
  hm: number;
  /** Intrinsic pixel size, so next/image picks a sensible source width. */
  iw: number;
  ih: number;
}

// Most of these are square canvases with a lot of baked-in transparent
// padding, which is why the rendered heights differ so much: F1 and Universal
// need far more box to make the mark itself read at the same visual weight.
export const MARQUEE_LOGOS: MarqueeLogo[] = [
  { src: "/home/logos/01-nba.jpg", alt: "NBA", h: 96, hm: 56, iw: 1024, ih: 1024 },
  { src: "/home/logos/02-mls.png", alt: "MLS", h: 96, hm: 56, iw: 1024, ih: 1024 },
  { src: "/home/logos/03-f1.png", alt: "Formula 1", h: 244, hm: 142, iw: 320, ih: 320 },
  { src: "/home/logos/04-universal.png", alt: "Universal Music Group", h: 293, hm: 171, iw: 1080, ih: 1080 },
  { src: "/home/logos/05-capitol.png", alt: "Capitol Records", h: 96, hm: 56, iw: 2560, ih: 1202 },
  { src: "/home/logos/06-warner.png", alt: "Warner", h: 102, hm: 59, iw: 1024, ih: 1024 },
  { src: "/home/logos/07-sony.png", alt: "Sony Music", h: 103, hm: 60, iw: 512, ih: 512 },
  { src: "/home/logos/08-interscope.png", alt: "Interscope Records", h: 96, hm: 56, iw: 1200, ih: 1772 },
  { src: "/home/logos/09-shady.png", alt: "Shady Records", h: 96, hm: 56, iw: 540, ih: 330 },
  { src: "/home/logos/10-red-bull.png", alt: "Red Bull", h: 96, hm: 56, iw: 3840, ih: 2160 },
  { src: "/home/logos/11-blue-man-group.png", alt: "Blue Man Group", h: 96, hm: 56, iw: 2480, ih: 2050 },
  { src: "/home/logos/12-bama.png", alt: "Alabama", h: 98, hm: 57, iw: 1200, ih: 1153 },
];

/* ---------------------------------------------------------------------------
   Case study rolodex cards
   --------------------------------------------------------------------------- */

export interface HomeCaseCard {
  slug: string;
  title: string;
  client: string;
  body: string;
  stat: string;
  thumbs: { src: string; alt: string }[];
}

export const CASE_CARDS: HomeCaseCard[] = [
  {
    slug: "pit-crew-chronicles",
    title: "Pit Crew Chronicles",
    client: "Red Bull Racing (Formula 1)",
    body: "Content Strategy, Cinematography, and edit for a five-episode series built to turn casual fans into F1 fanatics, one platform at a time.",
    stat: "A Foundational Red Bull Series",
    thumbs: [
      { src: "/home/case-studies/pit-crew-1.webp", alt: "Pit Crew Chronicles thumbnail 1" },
      { src: "/home/case-studies/pit-crew-2.webp", alt: "Pit Crew Chronicles thumbnail 2" },
      { src: "/home/case-studies/pit-crew-3.webp", alt: "Pit Crew Chronicles thumbnail 3" },
    ],
  },
  {
    slug: "las-vegas-grand-prix",
    title: "Las Vegas Grand Prix",
    client: "Blue Man Group × Red Bull Racing",
    body: "Creative direction, cinematography, and edit for a sonic collision of speed, sound, and spectacle.",
    stat: "200M+ — All-Time Most Viewed Campaign",
    thumbs: [
      { src: "/home/case-studies/lvgp-1.webp", alt: "Las Vegas Grand Prix thumbnail 1" },
      { src: "/home/case-studies/lvgp-2.webp", alt: "Las Vegas Grand Prix thumbnail 2" },
      { src: "/home/case-studies/lvgp-3.webp", alt: "Las Vegas Grand Prix thumbnail 3" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Testimonials
   --------------------------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
  logo: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Bo was a pleasure start to finish. His ability to work efficiently within the specifications of our brand concept and add creative flair at each stage of the production process made for an easy and enjoyable experience. He's the go-to creative lead from pre-production planning to post-production polish.",
    name: "Alex",
    company: "Red Bull",
    logo: "/home/logos/10-red-bull.png",
  },
  {
    quote:
      "Bo has a unique ability to serve as the backbone of any artist's vision that he comes across. His creativity and professionalism in developing meaningful stories and helping artists reach their fans sets the bar high in this marketplace. Down right amazing content that connects to any demo.",
    name: "Brian",
    company: "Starstruck",
    logo: "/home/logos/13-starstruck.png",
  },
  {
    quote:
      "Bo is far beyond an incredible creative and production partner that always brings the absolute highest level of awesome to the work we do. Equal parts self-starter, team player, and humble MVP, he's been a dream to work with, both creatively and logistically, and will always be a part of our professional family!",
    name: "Edward",
    company: "Interscope Records",
    logo: "/home/logos/08-interscope.png",
  },
];

/** Rotates in the testimonials headline. */
export const ROTATING_WORDS = [
  "athletes.", "artists.", "brands.", "companies.", "founders.", "owners.", "partners.",
];

/** Width of the headline is measured against this so it stays anchored. */
export const ROTATION_REFERENCE = "Trusted by: founders.";

export const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/bolatham/", label: "Instagram" },
  { href: "https://www.tiktok.com/@bolatham", label: "TikTok" },
  { href: "https://www.facebook.com/bolatham", label: "Facebook" },
  { href: "https://x.com/bolatham", label: "X" },
];

export const EMAIL = "BoLatham@gmail.com";
