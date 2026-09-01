import type { Metadata } from "next";
import { SpecBlock } from "@/components/spec-block";
import { formatShipped } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site records, which is almost nothing: no cookies, no analytics, no tracking scripts.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        Privacy
      </h1>

      <p className="mt-10 text-lg leading-relaxed">
        This is a portfolio, not a product. It collects nothing about you, and the
        short version fits in a box.
      </p>

      <div className="mt-10">
        <SpecBlock rows={site.privacy.summary} />
      </div>

      <dl className="mt-10 grid gap-3 border-y border-line py-6 sm:grid-cols-[8rem_1fr] sm:gap-x-4">
        <dt className="label text-muted">Responsible</dt>
        <dd className="font-mono text-sm">
          {site.name}, {site.location}
        </dd>
        <dt className="label mt-3 text-muted sm:mt-0">Contact</dt>
        <dd className="font-mono text-sm">
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            {site.email}
          </a>
        </dd>
      </dl>

      <div className="mt-14 grid gap-12">
        {site.privacy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="label text-muted">{section.heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-14 font-mono text-sm text-dim">
        Last updated {formatShipped(site.privacy.updated)}.
      </p>
    </div>
  );
}
