import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, getSimilarWork } from "@/data/case-studies";
import { shareVideo } from "@/data/share";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Rows from "@/components/case-study/rows";
import SimilarWork from "@/components/case-study/SimilarWork";
import "@/styles/site.css";
import "@/styles/case-study.css";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const description = `${study.client}. ${study.category}.`;
  // openGraph has to be restated here. Metadata merges per top-level key, so a
  // page that only sets `title` still inherits the root's og:title, and a
  // shared case study link would read "Bo Latham: Art Director & Brand
  // Strategist".
  // Restating it drops everything else the root declared, which is why the
  // video is spread back in. The image is the exception and still falls through
  // from app/opengraph-image.png.
  return {
    title: study.title,
    description,
    openGraph: {
      type: "website",
      siteName: "Bo Latham",
      title: study.title,
      description,
      url: `/case-studies/${study.slug}`,
      locale: "en_US",
      videos: [shareVideo],
    },
    twitter: {
      title: study.title,
      description,
    },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function CaseStudyPage({
  params,
}: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const similar = getSimilarWork(slug);

  return (
    <>
      <Nav active="Case Studies" />

      <header className="case-header">
        <span className="case-header__eyebrow">
          Case Study — {pad(study.index)} / {pad(caseStudies.length)}
        </span>
        <h1 className="case-header__title">{study.title}</h1>
        <dl className="case-header__meta">
          <div>
            <dt>Client</dt>
            <dd>{study.client}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{study.category}</dd>
          </div>
        </dl>
      </header>

      <main className="cs-main">
        <Rows rows={study.rows} />
      </main>

      {similar && (
        <SimilarWork study={similar} thumb={study.similarWorkThumb} />
      )}

      <Footer />
    </>
  );
}
