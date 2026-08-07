import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy, getSimilarWork } from "@/data/case-studies";
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
  return {
    title: study.title,
    description: `${study.client}. ${study.category}.`,
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
