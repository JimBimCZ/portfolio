import Image from "next/image";
import Link from "next/link";
import { formatShipped, type Project } from "@/content/projects";

/**
 * One entry in the log. The title carries a stretched link so the whole row is
 * clickable, which leaves the repository link free to sit inside the row as a
 * sibling rather than an illegal nested anchor.
 */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="group relative border-t border-line">
      <div className="grid gap-x-8 gap-y-5 py-8 sm:grid-cols-[7rem_1fr] lg:grid-cols-[7rem_1fr_18rem]">
        <p className="label text-accent">{project.shipped.replace("-", ".")}</p>

        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            <Link
              href={`/work/${project.slug}`}
              className="after:absolute after:inset-0 group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-xl text-muted">{project.summary}</p>
          <p className="label mt-4 text-muted">{project.stack.join(" / ")}</p>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="label relative mt-4 inline-block text-muted hover:text-accent"
            >
              GitHub
            </a>
          )}
          <span className="sr-only">Shipped {formatShipped(project.shipped)}</span>
        </div>

        {project.image && (
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
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
