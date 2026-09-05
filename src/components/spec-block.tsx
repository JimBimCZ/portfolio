/**
 * The site's signature element: a bracketed spec sheet, read as key/value
 * pairs. Corner ticks are drawn with borders rather than an image so they
 * inherit the accent token in both themes.
 *
 * The key column holds a 6rem floor and grows past it for the block's own
 * longest key: each row is its own grid, so `subgrid` is what keeps the
 * columns aligned across rows. It was a flat 6rem, which every block still
 * gets, but `toolkit`'s "infrastructure" overran it and printed against its
 * own value with no gap.
 */
export function SpecBlock({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <div className="relative bg-surface p-6 sm:p-8">
      <Tick className="left-0 top-0 border-l border-t" />
      <Tick className="right-0 top-0 border-r border-t" />
      <Tick className="bottom-0 left-0 border-b border-l" />
      <Tick className="bottom-0 right-0 border-b border-r" />
      <dl className="grid gap-3 sm:grid-cols-[minmax(6rem,auto)_1fr]">
        {rows.map(([key, value]) => (
          <div key={key} className="grid gap-1 sm:col-span-2 sm:grid-cols-subgrid sm:gap-x-4">
            <dt className="label text-accent">{key}</dt>
            <dd className="font-mono text-sm text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Tick({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-3 border-accent ${className}`}
    />
  );
}
