import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  siteDescription as description,
  shareVideo,
  siteUrl,
} from "@/data/share";
import "./globals.css";

// Self-hosted by next/font, so no request ever leaves for Google.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bo Latham",
    template: "%s | Bo Latham",
  },
  description,
  // Without these, Messages/Slack/etc. scrape the page and pick an arbitrary
  // image out of the Explore grid. The og:image itself comes from
  // app/opengraph-image.png via the file convention, which also emits
  // og:image:width / :height / :type.
  openGraph: {
    type: "website",
    siteName: "Bo Latham",
    // Apple's TN3156 asks that the site name stay out of og:title, since the
    // preview renders it separately.
    title: "Creative Director & Brand Strategist",
    description,
    url: "/",
    locale: "en_US",
    videos: [shareVideo],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Director & Brand Strategist",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Calluna, headlines only. Adobe Typekit kit otl3gko. */}
        <link rel="stylesheet" href="https://use.typekit.net/otl3gko.css" />
      </head>
      <body className="min-h-full">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
