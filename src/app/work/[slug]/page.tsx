import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { localiseProject } from "@/content/localise";
import { formatShipped, projects } from "@/content/projects";

const copy = getCopy("en");

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/work" className="label text-muted hover:text-accent">
        {copy.pages.project.back}
      </Link>

      <p className="label mt-12 text-accent">{formatShipped(project.shipped)}</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {project.title}
      </h1>
      <p className="mt-6 text-xl leading-relaxed text-muted">{project.summary}</p>

      {project.poster && (
        <Image
          src={project.poster}
          alt={project.posterAlt ?? ""}
          width={1440}
          height={900}
          // The one image on the page and its LCP candidate. `priority` is
          // deprecated in Next.js 16; these two props are what it stood for.
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 48rem, 100vw"
          className="mt-12 h-auto w-full border border-line"
        />
      )}

      <dl className="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-2">
        <div>
          <dt className="label text-muted">{copy.pages.project.role}</dt>
          <dd className="mt-2 font-mono text-sm">{project.role}</dd>
        </div>
        <div>
          <dt className="label text-muted">{copy.pages.project.stack}</dt>
          <dd className="mt-2 font-mono text-sm">{project.stack.join(", ")}</dd>
        </div>
      </dl>

      <h2 className="label mt-14 text-muted">{copy.pages.project.whatItBrings}</h2>
      <ul className="mt-6 grid gap-4">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-4 text-lg leading-relaxed">
            <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-accent" />
            {highlight}
          </li>
        ))}
      </ul>

      {(project.liveUrl || project.repo) && (
        <div className="mt-14 flex flex-wrap gap-6">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="label border border-line px-5 py-3 hover:border-accent hover:text-accent"
            >
              {copy.pages.project.visitSite}
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="label border border-line px-5 py-3 hover:border-accent hover:text-accent"
            >
              {copy.pages.project.source}
            </a>
          )}
        </div>
      )}

      {project.liveUrl && project.liveNote && (
        <p className="mt-6 max-w-xl text-sm text-muted">{project.liveNote}</p>
      )}
    </article>
  );
}
