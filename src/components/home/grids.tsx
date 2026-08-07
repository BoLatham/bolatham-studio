import WorkCell from "@/components/home/WorkCell";
import {
  ALL_IDS,
  ALL_RATIOS,
  DESIGN_IDS,
  DESIGN_RATIOS_INITIAL,
  DESIGN_RATIOS_MORE,
  SOCIAL_IDS,
  SOCIAL_RATIO,
  VIDEO_IDS,
  VIDEO_RATIOS_INITIAL,
  VIDEO_RATIOS_MORE,
  type WorkId,
} from "@/data/home";

/**
 * The four Explore layouts.
 *
 * These are deliberately four separate components rather than one grid with
 * conditional flags, because the layouts do not share a structure: All fills
 * columns in pairs, Design switches from flat rows to a masonry on expand,
 * Video is column-major from the start, and Social & Web is a single fixed row
 * with no expansion at all.
 */

const NUM_COLS = 4;

/** Wraps stacked cells into one grid track. */
function Column({ children }: { children: React.ReactNode }) {
  return <div className="explore-col">{children}</div>;
}

/* ---------------------------------------------------------------------------
   ALL
   8 items, then 8 more. Columns fill in chunks of 2 (a top/bottom pair) so
   that expanding never reshuffles which column an earlier item sits in.
   --------------------------------------------------------------------------- */

export function AllGrid({ expanded }: { expanded: boolean }) {
  const count = expanded ? 16 : 8;
  const columns: { id: WorkId; ratio: string }[][] = Array.from(
    { length: NUM_COLS },
    () => [],
  );

  for (let i = 0; i < count; i++) {
    const col = Math.floor(i / 2) % NUM_COLS;
    columns[col].push({ id: ALL_IDS[i], ratio: ALL_RATIOS[i] });
  }

  return (
    <>
      {columns.map((cells, c) => (
        <Column key={c}>
          {cells.map((cell) => (
            <WorkCell key={cell.id} id={cell.id} ratio={cell.ratio} />
          ))}
        </Column>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------------
   DESIGN
   Two fixed rows first: four squares, then four at 3:4. These are flat grid
   children, so they simply flow across the four tracks. Expanding appends a
   masonry of four columns holding two stacked images each.
   --------------------------------------------------------------------------- */

export function DesignGrid({ expanded }: { expanded: boolean }) {
  return (
    <>
      {DESIGN_RATIOS_INITIAL.map((ratio, i) => (
        <WorkCell key={DESIGN_IDS[i]} id={DESIGN_IDS[i]} ratio={ratio} />
      ))}

      {expanded &&
        Array.from({ length: NUM_COLS }, (_, c) => (
          <Column key={`more-${c}`}>
            {[0, 1].map((row) => {
              const i = c * 2 + row;
              return (
                <WorkCell
                  key={DESIGN_IDS[8 + i]}
                  id={DESIGN_IDS[8 + i]}
                  ratio={DESIGN_RATIOS_MORE[i]}
                />
              );
            })}
          </Column>
        ))}
    </>
  );
}

/* ---------------------------------------------------------------------------
   VIDEO
   Column-major from the start: four columns of two stacked clips, alternating
   16:9 and 9:16 by position. Expanding adds four more columns which, because
   every ratio there is uniform, read as two further rows of four.
   --------------------------------------------------------------------------- */

function videoColumns(offset: number, ratios: string[]) {
  return Array.from({ length: NUM_COLS }, (_, c) => (
    <Column key={`${offset}-${c}`}>
      {[0, 1].map((row) => {
        const i = c * 2 + row;
        return (
          <WorkCell
            key={VIDEO_IDS[offset + i]}
            id={VIDEO_IDS[offset + i]}
            ratio={ratios[i]}
          />
        );
      })}
    </Column>
  ));
}

export function VideoGrid({ expanded }: { expanded: boolean }) {
  return (
    <>
      {videoColumns(0, VIDEO_RATIOS_INITIAL)}
      {expanded && videoColumns(8, VIDEO_RATIOS_MORE)}
    </>
  );
}

/* ---------------------------------------------------------------------------
   SOCIAL & WEB
   One row of four at the clips' native 1920x968. No expansion, and the caller
   hides the Load More button entirely for this filter.
   --------------------------------------------------------------------------- */

export function SocialGrid() {
  return (
    <>
      {SOCIAL_IDS.map((id) => (
        <WorkCell key={id} id={id} ratio={SOCIAL_RATIO} />
      ))}
    </>
  );
}
