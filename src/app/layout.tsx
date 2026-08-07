import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Self-hosted by next/font, so no request ever leaves for Google.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bolatham.studio"),
  title: {
    default: "Bo Latham",
    template: "%s | Bo Latham",
  },
  description:
    "Nashville-based creative director and brand strategist. Full-service production across music, sports, and culture-driven spaces.",
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
