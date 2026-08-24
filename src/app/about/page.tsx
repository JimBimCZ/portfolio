import type { Metadata } from "next";
import { SpecBlock } from "@/components/spec-block";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.bio[0],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        About
      </h1>

      <div className="mt-10 grid gap-6 text-lg leading-relaxed">
        {site.bio.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? undefined : "text-muted"}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14">
        <SpecBlock rows={site.manifest} />
      </div>

      <section aria-labelledby="experience" className="mt-16">
        <h2 id="experience" className="label text-muted">
          Experience
        </h2>
        <ul aria-labelledby="experience" className="mt-8 border-t border-line">
          {site.experience.map((job) => (
            <li key={`${job.org}-${job.period}`} className="border-b border-line py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
                  {job.role}
                </h3>
                <p className="label text-accent">{job.period}</p>
              </div>
              <p className="mt-1 font-mono text-sm text-muted">{job.org}</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{job.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="toolkit" className="mt-16">
        <h2 id="toolkit" className="label text-muted">
          Toolkit
        </h2>
        <div className="mt-8">
          <SpecBlock rows={site.skills} />
        </div>
      </section>
    </div>
  );
}
