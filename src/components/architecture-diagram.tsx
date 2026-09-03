import type { LocalisedArchitecture } from "@/content/localise";

/**
 * A project's wiring as one CSS grid: bands are rows, and each edge that
 * cannot be drawn between two adjacent rows gets a lane of its own in the
 * gutter on the left.
 *
 * It is markup rather than an image on purpose. A picture would need one file
 * per theme, would not follow a token change, and would say nothing to a
 * screen reader without alt text repeating the whole diagram in prose.
 */
export function ArchitectureDiagram({
  architecture,
  label,
}: {
  architecture: LocalisedArchitecture;
  label: string;
}) {
  const { bands, edges, decisions } = architecture;

  // Band i occupies grid row i*2+1; row i*2+2 is the gap where a connector
  // between band i and band i+1 is drawn.
  const rowOf = new Map(bands.map((band, index) => [band.band, index * 2 + 1]));

  const placed = edges.flatMap((edge) => {
    const from = rowOf.get(edge.from);
    const to = rowOf.get(edge.to);
    // Unreachable with the data in architecture.ts, whose test asserts every
    // edge names a populated band. Guarding keeps a bad edit from throwing
    // inside the grid maths instead of failing that test.
    return from === undefined || to === undefined ? [] : [{ edge, from, to }];
  });

  const inline = placed.filter(({ from, to }) => to - from === 2);
  const gutter = placed.filter(({ from, to }) => to - from !== 2);
  const content = gutter.length + 1;

  // `repeat(0, …)` is invalid, and an invalid track list takes the whole
  // declaration down with it — including the `minmax(0, 1fr)` that stops a long
  // node name from widening the grid past the viewport. No project has zero
  // gutter edges today; one whose edges all run down between adjacent bands
  // would.
  const columns =
    gutter.length > 0
      ? `repeat(${gutter.length}, 1.25rem) minmax(0, 1fr)`
      : "minmax(0, 1fr)";

  return (
    <>
      <div
        role="group"
        aria-label={label}
        className="mt-6 grid gap-x-2"
        style={{ gridTemplateColumns: columns }}
      >
        {gutter.map(({ edge, from, to }, lane) => (
          <GutterEdge
            key={`${edge.from}-${edge.to}-${edge.protocol}`}
            protocol={edge.protocol}
            column={lane + 1}
            from={from}
            to={to}
          />
        ))}

        {bands.map((band, index) => (
          <section
            key={band.band}
            style={{ gridRow: index * 2 + 1, gridColumn: content }}
            className="border border-line bg-surface p-4"
          >
            <h3 className="label text-muted">{band.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {band.nodes.map((node) => (
                <li
                  key={node.id}
                  className="max-w-full border border-line-soft bg-raised px-3 py-2"
                >
                  <p className="font-mono text-sm break-words">{node.name}</p>
                  {node.note && <p className="mt-1 text-xs text-dim">{node.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {inline.map(({ edge, from }) => (
          <p
            key={`${edge.from}-${edge.to}-${edge.protocol}`}
            style={{ gridRow: from + 1, gridColumn: content }}
            className="flex items-center gap-3 py-1 pl-6"
          >
            <span aria-hidden className="h-8 w-px bg-line" />
            {/* Protocols are facts and stay English in both trees, so under
                `lang="cs"` they are an English run and marked as one — the same
                rule `experience-log.tsx` applies to job titles. */}
            <span className="label text-dim" lang="en">
              {edge.protocol}
            </span>
          </p>
        ))}
      </div>

      <ol className="mt-8 grid gap-4">
        {decisions.map((decision) => (
          <li key={decision.choice} className="flex gap-4 leading-relaxed">
            <span aria-hidden className="mt-3 h-px w-6 shrink-0 bg-accent" />
            <span>
              {/* The choice is its own element, not a bare text node, so that a
                  test can query it apart from the reason that follows it. */}
              <span className="text-text">{decision.choice}</span>{" "}
              <span className="text-muted">{decision.because}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * An edge the stack cannot draw between two adjacent rows: it runs upward
 * (Trader's price stream, Work Planner's Pusher channel) or skips a band
 * (an upload going straight from the browser to S3). One per lane, so two of
 * them never sit on top of each other.
 */
function GutterEdge({
  protocol,
  column,
  from,
  to,
}: {
  protocol: string;
  column: number;
  from: number;
  to: number;
}) {
  const upward = to < from;
  const start = Math.min(from, to);
  const end = Math.max(from, to);

  return (
    <span
      data-testid="gutter-edge"
      style={{ gridColumn: column, gridRow: `${start} / ${end + 1}` }}
      className="relative flex items-center justify-center"
    >
      <span aria-hidden className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-line" />
      <span
        aria-hidden
        className={`absolute left-1/2 size-2 -translate-x-1/2 rotate-45 border-accent ${
          upward ? "top-3 border-l border-t" : "bottom-3 border-b border-r"
        }`}
      />
      {/* English inside the Czech tree, like the inline connector above. */}
      <span
        lang="en"
        className="label relative rotate-180 bg-canvas py-2 text-dim [writing-mode:vertical-rl]"
      >
        {protocol}
      </span>
    </span>
  );
}
