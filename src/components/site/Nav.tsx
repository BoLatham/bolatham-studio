"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#case-studies", label: "Case Studies" },
  { href: "/#contact", label: "Contact" },
];

interface Props {
  /** Which link renders as current. */
  active?: string;
  /**
   * Home only. Starts fully transparent and interpolates background alpha,
   * blur and border across the height of the hero.
   */
  fadeOverHero?: boolean;
}

/**
 * Site navigation. Built rather than imported: the only genuinely distinctive
 * behaviour is the scroll interpolation over the Home hero, which no
 * off-the-shelf component provides, and the rest is four links and a panel.
 *
 * The "Menu" trigger is mobile-only, matching the case study mockups. The Home
 * mockup left it visible at all widths, which was an oversight.
 */
export default function Nav({ active, fadeOverHero }: Props) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Scroll-driven chrome over the hero. Reads the hero's real height rather
  // than a fixed pixel value, so it stays correct at any viewport.
  useEffect(() => {
    if (!fadeOverHero) return;
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      const hero = document.getElementById("heroMedia");
      const height = hero?.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
      nav.style.backgroundColor = `rgba(31,30,31,${(0.82 * progress).toFixed(3)})`;
      nav.style.backdropFilter = `blur(${(10 * progress).toFixed(1)}px)`;
      nav.style.borderBottomColor = `rgba(239,241,237,${(0.08 * progress).toFixed(3)})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [fadeOverHero]);

  // Lock background scroll while the panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className={fadeOverHero ? "nav nav--fade" : "nav"} ref={navRef}>
        <Link className="nav__mark" href="/" aria-label="Bo Latham, home">
          <Image
            src="/brand/logo.svg"
            alt="Bo Latham"
            width={53}
            height={40}
            priority
            unoptimized
          />
        </Link>

        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={active === l.label ? "is-active" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* No `hidden` attribute here: it would kill the fade-out. The CSS uses
          visibility: hidden, which already removes the panel from both the tab
          order and the accessibility tree once the transition finishes. */}
      <div className="nav__panel" id="nav-panel" data-open={open}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav__panel-meta">Nashville, TN</div>
      </div>
    </>
  );
}
