import { EMAIL, SOCIAL_LINKS } from "@/data/home";

const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  TikTok: (
    <>
      <circle cx="9" cy="17" r="3" />
      <path d="M12 17V4a5 5 0 0 0 5 5" />
    </>
  ),
  Facebook: <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />,
  X: <path d="M4 4l16 16M20 4L4 20" />,
};

/** Deliberately minimal: one mailto and the social row. No form. */
export default function ContactCta() {
  return (
    <section className="contact-cta" id="contact">
      <h2 className="contact-cta__headline">Need to stop the scroll?</h2>
      <p className="contact-cta__body">
        Available for art and creative direction, brand and content strategy,
        and full-scale production work.
      </p>
      <a className="contact-cta__button" href={`mailto:${EMAIL}`}>
        Get in touch
      </a>
      <div className="social-row">
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            className="social-btn"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ICONS[s.label]}
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
