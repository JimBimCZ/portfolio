import type { LocalisedPipeline } from "@/content/localise";

/**
 * The path a request takes, as an ordered list rather than a second grid.
 *
 * `ArchitectureDiagram` answers "what is this wired to", and it answers it by
 * position: a node's band is its row. A sequence has no bands — every step
 * here but the first and the last happens inside `server` — so drawing it the
 * same way would put eight boxes in one row and lose the only thing worth
 * showing, which is the order. A numbered list carries that for free, in the
 * markup rather than in a picture of it, and a screen reader reads it as the
 * eight ordered steps it is.
 *
 * A `guard` step is one the request can end at. It gets an accent branch
 * pointing out of the flow; what happens on that branch is in the step's own
 * prose, which is why the mark itself is decorative — a Czech reader gets the
 * explanation in Czech rather than an English label bolted onto the arrow.
 */
export function AnswerPipeline({ pipeline }: { pipeline: LocalisedPipeline }) {
  return (
    <section className="mt-8">
      <h3 className="label text-muted">{pipeline.title}</h3>

      <ol className="mt-4 border border-line bg-surface">
        {pipeline.steps.map((step, index) => (
          <li
            key={step.id}
            data-testid="pipeline-step"
            className="flex gap-4 border-b border-line-soft px-4 py-3 last:border-b-0"
          >
            <span aria-hidden className="label w-5 shrink-0 pt-0.5 text-dim">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              {/* Module paths are facts and stay English in both trees, the
                  same rule the diagram's protocols follow. */}
              <p className="font-mono text-sm break-words" lang="en">
                {step.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
            </div>

            {step.guard && (
              <span
                aria-hidden
                data-testid="pipeline-branch"
                className="flex shrink-0 items-center gap-1.5 pt-1.5"
              >
                <span className="h-px w-5 bg-accent" />
                <span className="size-1.5 rotate-45 border-r border-t border-accent" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
