import type { CSSProperties } from "react";
import type { Row } from "@/data/case-studies";
import Cell from "@/components/case-study/Cell";

/**
 * Row renderers. Each row type is its own component with its own layout rules
 * rather than one grid with conditional flags, because the types genuinely
 * differ: triptych is an off-centre 3-column with a scaled middle, full swaps
 * two separate crops, stat-pair bakes numbers into each cell.
 */

const THIRD = "(max-width: 780px) 100vw, 33vw";
const HALF = "(max-width: 780px) 100vw, 50vw";
const FULL = "100vw";

function rowClass(base: string, spaced?: boolean) {
  return spaced ? `${base} row--spaced` : base;
}

/* ---------- text ---------- */

function TextRow({ row }: { row: Extract<Row, { type: "text" }> }) {
  return (
    <div className="row row--text">
      <span className="eyebrow">{row.eyebrow}</span>
      <p className="headline">{row.headline}</p>
      <p className="body">{row.body}</p>
    </div>
  );
}

/* ---------- triptych: static / motion / static ---------- */

function TriptychRow({ row }: { row: Extract<Row, { type: "triptych" }> }) {
  return (
    <div className={rowClass("row row--triptych", row.spaced)}>
      {row.cells.map((cell, i) => (
        <Cell
          key={i}
          cell={cell}
          sizes={THIRD}
          className={cell.motion ? "cell--motion" : undefined}
          style={
            row.mobileOrder
              ? ({ "--mobile-order": row.mobileOrder[i] } as CSSProperties)
              : undefined
          }
        />
      ))}
    </div>
  );
}

/* ---------- full-bleed stat overlay ---------- */

function FullRow({ row }: { row: Extract<Row, { type: "full" }> }) {
  // Two DOM cells swapped by CSS at 780px, not one image resized. The crops
  // are genuinely different: 21:9 desktop against 4:5 mobile.
  return (
    <div className={rowClass("row row--full", row.spaced)}>
      <Cell
        cell={row.desktop}
        sizes={FULL}
        className="cell--full cell--desktop-only"
        priority
      />
      <Cell
        cell={row.mobile}
        sizes={FULL}
        className="cell--full cell--mobile-only"
        priority
      />
    </div>
  );
}

/* ---------- pair (no stats) ---------- */

function PairRow({ row }: { row: Extract<Row, { type: "pair" }> }) {
  return (
    <div className="row row--pair">
      {row.cells.map((cell, i) => (
        <Cell key={i} cell={cell} sizes={HALF} />
      ))}
    </div>
  );
}

/* ---------- stat pair ---------- */

function StatPairRow({ row }: { row: Extract<Row, { type: "stat-pair" }> }) {
  // Same grid as pair; the cells carry stats, which Cell renders as a scrim
  // plus number and caption.
  return (
    <div className="row row--pair">
      {row.cells.map((cell, i) => (
        <Cell key={i} cell={cell} sizes={HALF} />
      ))}
    </div>
  );
}

/* ---------- trio ---------- */

function TrioRow({ row }: { row: Extract<Row, { type: "trio" }> }) {
  return (
    <div className="row row--trio">
      {row.cells.map((cell, i) => (
        <Cell key={i} cell={cell} sizes={THIRD} />
      ))}
    </div>
  );
}

/* ---------- dispatcher ---------- */

export default function Rows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((row, i) => {
        switch (row.type) {
          case "text":
            return <TextRow key={i} row={row} />;
          case "triptych":
            return <TriptychRow key={i} row={row} />;
          case "full":
            return <FullRow key={i} row={row} />;
          case "pair":
            return <PairRow key={i} row={row} />;
          case "stat-pair":
            return <StatPairRow key={i} row={row} />;
          case "trio":
            return <TrioRow key={i} row={row} />;
        }
      })}
    </>
  );
}
