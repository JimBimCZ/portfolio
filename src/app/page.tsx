import Link from "next/link";
import { ProjectRow } from "@/components/project-row";
import { SpecBlock } from "@/components/spec-block";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="grid items-start gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <p className="label text-accent">
            {site.role} · {site.location}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            {site.tagline}
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
            {site.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="label bg-accent px-5 py-3 text-canvas transition-opacity hover:opacity-85"
            >
              View work
            </Link>
            <Link
              href="/contact"
              className="label border border-line px-5 py-3 text-text transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
            </Link>
          </div>
        </div>
        <SpecBlock rows={site.manifest} />
      </section>

      <section aria-labelledby="selected-work" className="py-12">
        <div className="flex items-baseline justify-between gap-6">
          <h2 id="selected-work" className="label text-muted">
            Recent work
          </h2>
          <Link href="/work" className="label text-muted hover:text-accent">
            All projects →
          </Link>
        </div>
        <ul className="mt-8 border-b border-line">
          {projects.slice(0, 3).map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </ul>
      </section>
    </div>
  );
}
