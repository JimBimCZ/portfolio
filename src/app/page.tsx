import Link from "next/link";
import { AppCarousel } from "@/components/app-carousel";
import { ExperienceLog } from "@/components/experience-log";
import { SkillMatrix } from "@/components/skill-matrix";
import { SpecBlock } from "@/components/spec-block";
import { carouselProjects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
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

      <div className="py-12">
        <AppCarousel projects={carouselProjects} />
      </div>

      <section aria-labelledby="what-each-one-is" className="py-16">
        <div className="flex items-baseline justify-between gap-6">
          <h2 id="what-each-one-is" className="label text-muted">
            What each one actually is
          </h2>
          <Link href="/work" className="label text-muted hover:text-accent">
            All projects →
          </Link>
        </div>
        <ul className="mt-8 divide-y divide-line-soft border-t border-line">
          {carouselProjects.map((project) => (
            <li key={project.slug} className="py-6">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                <Link href={`/work/${project.slug}`} className="hover:text-accent">
                  {project.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-2xl text-muted">{project.summary}</p>
              <p className="label mt-3 text-dim">
                {project.metrics.map((metric) => `${metric.value} ${metric.label}`).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="track-record" className="py-16">
        <div className="flex items-baseline justify-between gap-6">
          <h2 id="track-record" className="label text-muted">
            Track record
          </h2>
          <Link href="/about" className="label text-muted hover:text-accent">
            Full history →
          </Link>
        </div>
        <div className="mt-8">
          <ExperienceLog roles={site.experience} />
        </div>
      </section>

      <section aria-labelledby="skills" className="py-16">
        <h2 id="skills" className="label text-muted">
          Skills, with receipts
        </h2>
        <div className="mt-8">
          <SkillMatrix groups={skillGroups} />
        </div>
      </section>

      <section aria-labelledby="contact" className="border-t border-line py-16">
        <h2 id="contact" className="label text-muted">
          Contact
        </h2>
        <div className="mt-8 grid gap-x-12 gap-y-4 sm:grid-cols-2">
          <a
            href={`mailto:${site.email}`}
            className="label text-text hover:text-accent"
          >
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.replace(/\s+/g, "")}`}
            className="label text-text hover:text-accent"
          >
            {site.phone}
          </a>
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-text hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <p className="label text-muted">{site.location}</p>
        </div>
      </section>
    </div>
  );
}
