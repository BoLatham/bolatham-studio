import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import ExploreGrid from "@/components/home/ExploreGrid";
import CaseStudyStack from "@/components/home/CaseStudyStack";
import Testimonials from "@/components/home/Testimonials";
import ContactCta from "@/components/home/ContactCta";
import "@/styles/site.css";
import "@/styles/home.css";

/**
 * Single-page Home. Nav links are anchors into this page; there is no separate
 * Work or About route by design.
 */
export default function Home() {
  return (
    <>
      <Nav active="Home" fadeOverHero />
      <Hero />
      <LogoMarquee />
      <ExploreGrid />
      <CaseStudyStack />
      <Testimonials />
      <ContactCta />
      <Footer />
    </>
  );
}
