import { AppMedia } from "./app-media";
import type { Copy } from "@/content/copy";
import type { LocalisedProject } from "@/content/localise";

/**
 * One slide. The whole card is a single anchor, so it is keyboard-operable and
 * middle-clickable for free — no div with a click handler.
 *
 * A card without a deployment falls back to the repository: the header says so
 * rather than promising a live app, and the status dot stays unlit, because a
 * green dot next to a project nobody can open is a claim the card cannot back.
 * `projects.ts` guarantees one or the other exists.
 */
export function AppCard({
  project,
  active,
  labels,
  statuses,
}: {
  project: LocalisedProject;
  active: boolean;
  labels: Copy["ui"]["carousel"];
  statuses: Copy["ui"]["status"];
}) {
  const deployed = Boolean(project.liveUrl);
  const target = project.liveUrl ?? project.repo;
  const host = target?.replace(/^https:\/\//, "") ?? "";

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      // Inactive slides sit clipped outside the carousel's viewport (see
      // AppCarousel's overflow-hidden + translateX track). Their links stay
      // in the accessibility tree — so AT users can discover every project,
      // matching the "every project is reachable" requirement — but drop out
      // of the Tab order, so a sighted keyboard user's focus never lands on
      // something they can't see.
      tabIndex={active ? undefined : -1}
      // With aria-hidden dropped, all five links sit in the tree at once —
      // aria-current is what tells a screen-reader user (e.g. browsing a
      // rotor links list, not the tablist) which one matches the screen.
      aria-current={active ? "true" : undefined}
      className="block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent"
    >
      <div className="flex items-center gap-3 border-b border-line-soft bg-raised px-4 py-2.5">
        <span
          aria-hidden
          className={`size-1.5 shrink-0 rounded-full ${deployed ? "bg-live" : "bg-dim"}`}
        />
        <span className="text-sm font-medium">{project.title}</span>
        <span className="font-mono text-xs text-dim">{host}</span>
        {project.status !== "live" && (
          <span className="label rounded border border-line px-1.5 py-0.5 text-dim">
            {statuses[project.status]}
          </span>
        )}
        <span className="label ml-auto text-accent">
          {deployed ? labels.openLiveApp : labels.openSource}
        </span>
      </div>

      <AppMedia project={project} active={active} />

      <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-line-soft px-4 py-3.5">
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="font-mono text-base font-semibold">{metric.value}</div>
            <div className="text-xs text-dim">{metric.label}</div>
          </div>
        ))}
        {project.signInRequired && (
          <div className="ml-auto text-right text-xs text-dim">
            <div>{labels.signInRequired}</div>
            {project.demo && (
              <div className="font-mono text-muted">
                <span>{project.demo.email}</span> · <span>{project.demo.password}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
