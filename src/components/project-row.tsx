import Image from "next/image";
import Link from "next/link";
import type { Copy } from "@/content/copy";
import { formatShipped } from "@/content/projects";
import type { LocalisedProject } from "@/content/localise";

/**
 * One entry in the log. The title carries a stretched link so the whole row is
 * clickable, which leaves the repository link free to sit inside the row as a
 * sibling rather than an illegal nested anchor.
 */
export function ProjectRow({
  project,
  copy,
}: {
  project: LocalisedProject;
  copy: Copy;
}) {
  return (
    <li className="group relative border-t border-line">
      <div className="grid gap-x-8 gap-y-5 py-8 sm:grid-cols-[7rem_1fr] lg:grid-cols-[7rem_1fr_18rem]">
        <p className="label text-accent">{project.shipped.replace("-", ".")}</p>

        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight">
              <Link
                href={`/work/${project.slug}`}
                className="after:absolute after:inset-0 group-hover:text-accent"
              >
                {project.title}
              </Link>
            </h3>
            {project.status !== "live" && (
              <span className="label rounded border border-line px-1.5 py-0.5 text-dim">
                {copy.ui.status[project.status]}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-xl text-muted">{project.summary}</p>
          <p className="label mt-4 text-muted">{project.stack.join(" / ")}</p>
          {(project.liveUrl || project.repo) && (
            <div className="mt-4 flex flex-wrap gap-6">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="label relative text-muted hover:text-accent"
                >
                  {copy.pages.work.liveDemo}
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="label relative text-muted hover:text-accent"
                >
                  {copy.pages.work.repo}
                </a>
              )}
            </div>
          )}
          <span className="sr-only">
            {copy.pages.work.shipped} {formatShipped(project.shipped)}
          </span>
        </div>

        {project.poster && (
          <Image
            src={project.poster}
            alt={project.posterAlt ?? ""}
            width={1440}
            height={900}
            sizes="(min-width: 1024px) 18rem, 100vw"
            className="h-auto w-full border border-line sm:col-start-2 lg:col-start-3 lg:row-start-1"
          />
        )}
      </div>
    </li>
  );
}
