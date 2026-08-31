import { AppMedia } from "./app-media";
import type { Project } from "@/content/projects";

/**
 * One slide. The whole card is a single anchor, so it is keyboard-operable and
 * middle-clickable for free — no div with a click handler.
 */
export function AppCard({ project, active }: { project: Project; active: boolean }) {
  const host = project.liveUrl?.replace(/^https:\/\//, "") ?? "";

  return (
    <a
      href={project.liveUrl}
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
        <span className="size-1.5 shrink-0 rounded-full bg-live" aria-hidden />
        <span className="text-sm font-medium">{project.title}</span>
        <span className="font-mono text-xs text-dim">{host}</span>
        {project.status === "in-development" && (
          <span className="label rounded border border-line px-1.5 py-0.5 text-dim">
            In development
          </span>
        )}
        <span className="label ml-auto text-accent">Open live app →</span>
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
            <div>Sign-in required</div>
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
