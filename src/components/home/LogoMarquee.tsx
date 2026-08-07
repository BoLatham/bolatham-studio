import Image from "next/image";
import { MARQUEE_LOGOS } from "@/data/home";

/**
 * Client logo strip.
 *
 * The track holds the logo set twice and translates exactly -50%, so the loop
 * lands on the duplicate and reads as continuous. The second pass is hidden
 * from assistive tech to avoid announcing every client twice.
 */
export default function LogoMarquee() {
  return (
    <div className="marquee-outer">
      <div className="marquee">
        <div className="marquee__track">
          {[0, 1].map((pass) =>
            MARQUEE_LOGOS.map((logo) => (
              <div
                key={`${pass}-${logo.src}`}
                className="marquee__item"
                style={
                  {
                    "--h": `${logo.h}px`,
                    "--hm": `${logo.hm}px`,
                  } as React.CSSProperties
                }
                aria-hidden={pass === 1 ? true : undefined}
              >
                <Image
                  src={logo.src}
                  alt={pass === 1 ? "" : logo.alt}
                  height={logo.h}
                  width={Math.round(logo.h * (logo.iw / logo.ih))}
                  style={{ height: "var(--h)", width: "auto" }}
                />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
