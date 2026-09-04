import { SpecBlock } from "@/components/spec-block";
import type { Copy } from "@/content/copy";

/**
 * Bio, manifest and toolkit. The employment history used to sit between the
 * last two as a second hand-rolled copy of the home page's track record; it
 * lives on `/experience` now, rendered by the same `ExperienceLog` both other
 * places use.
 */
export function AboutPage({ copy }: { copy: Copy }) {
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
