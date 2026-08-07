"use client";

import { useState } from "react";
import { FILTERS, type FilterId } from "@/data/home";
import { AllGrid, DesignGrid, VideoGrid, SocialGrid } from "@/components/home/grids";

/**
 * Explore Recent Projects.
 *
 * Owns only the filter selection and the expanded flag. Each filter's layout
 * lives in its own component; this decides which one renders and whether the
 * Load More control applies to it.
 */
export default function ExploreGrid() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [expanded, setExpanded] = useState(false);

  // Social & Web is a single fixed row. It has no second batch, so it gets no
  // button at all rather than a disabled one.
  const canExpand = filter !== "social-web";

  function selectFilter(next: FilterId) {
    setFilter(next);
    setExpanded(false);
  }

  return (
    <section className="section explore" id="work">
      <h2 className="display-headline">
        Explore Recent Projects<span className="red">:</span>
      </h2>

      <div className="filter-bar" role="tablist" aria-label="Filter work">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`filter-btn${filter === f.id ? " is-active" : ""}`}
            onClick={() => selectFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="explore-grid">
        {filter === "all" && <AllGrid expanded={expanded} />}
        {filter === "design" && <DesignGrid expanded={expanded} />}
        {filter === "video" && <VideoGrid expanded={expanded} />}
        {filter === "social-web" && <SocialGrid />}
      </div>

      {canExpand && (
        <div className="load-more-wrap">
          <button
            type="button"
            className="load-more-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "See Less" : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
