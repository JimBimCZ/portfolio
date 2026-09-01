import { SpecBlock } from "@/components/spec-block";
import type { Copy, Locale } from "@/content/copy";
import { formatShipped } from "@/content/projects";
import { site } from "@/content/site";

export function PrivacyPage({ copy, locale }: { copy: Copy; locale: Locale }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.privacy.title}
      </h1>

      <p className="mt-10 text-lg leading-relaxed">{copy.pages.privacy.lede}</p>

      <div className="mt-10">
        <SpecBlock rows={copy.person.privacy.summary} />
      </div>

      <dl className="mt-10 grid gap-3 border-y border-line py-6 sm:grid-cols-[8rem_1fr] sm:gap-x-4">
        <dt className="label text-muted">{copy.pages.privacy.responsible}</dt>
        <dd className="font-mono text-sm">
          {site.name}, {copy.person.location}
        </dd>
        <dt className="label mt-3 text-muted sm:mt-0">{copy.pages.privacy.contact}</dt>
        <dd className="font-mono text-sm">
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            {site.email}
          </a>
        </dd>
      </dl>

      <div className="mt-14 grid gap-12">
        {copy.person.privacy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="label text-muted">{section.heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      {/* Label and value: `formatShipped` returns a nominative month, which
          Czech cannot put after a preposition. The label carries the locale's
          own separator — a colon in Czech, nothing in English. */}
      <p className="mt-14 font-mono text-sm text-dim">
        {copy.pages.privacy.updated} {formatShipped(copy.person.privacy.updated, locale)}.
      </p>
    </div>
  );
}
