/**
 * The site's signature element: a bracketed spec sheet, read as key/value
 * pairs. Corner ticks are drawn with borders rather than an image so they
 * inherit the accent token in both themes.
 */
export function SpecBlock({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <div className="relative bg-surface p-6 sm:p-8">
      <Tick className="left-0 top-0 border-l border-t" />
      <Tick className="right-0 top-0 border-r border-t" />
      <Tick className="bottom-0 left-0 border-b border-l" />
      <Tick className="bottom-0 right-0 border-b border-r" />
      <dl className="grid gap-3">
        {rows.map(([key, value]) => (
          <div key={key} className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
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
