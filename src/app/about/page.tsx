import type { Metadata } from "next";
import { SpecBlock } from "@/components/spec-block";
import { getCopy } from "@/content/copy";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.about.title,
  description: copy.meta.about.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.about.title}
      </h1>

      <div className="mt-10 grid gap-6 text-lg leading-relaxed">
        {copy.person.bio.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? undefined : "text-muted"}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14">
        <SpecBlock rows={copy.person.manifest} />
      </div>

      <section aria-labelledby="experience" className="mt-16">
        <h2 id="experience" className="label text-muted">
          {copy.pages.about.experience}
        </h2>
        <ul aria-labelledby="experience" className="mt-8 border-t border-line">
          {copy.person.experience.map((job) => (
            <li key={`${job.org}-${job.period}`} className="border-b border-line py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
                  {job.title}
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
          {copy.pages.about.toolkit}
        </h2>
        <div className="mt-8">
          <SpecBlock rows={copy.person.toolkit} />
        </div>
      </section>
    </div>
  );
}
