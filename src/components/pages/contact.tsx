import type { Copy } from "@/content/copy";
import { site } from "@/content/site";

export function ContactPage({ copy }: { copy: Copy }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="label text-accent">{copy.person.status}</p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.contact.title}
      </h1>

      <a
        href={`mailto:${site.email}`}
        className="mt-10 inline-block border-b border-accent pb-1 font-mono text-lg text-accent hover:opacity-80"
      >
        {site.email}
      </a>

      <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted">
        {copy.pages.contact.body}
      </p>

      <dl className="mt-14 grid gap-4 border-t border-line pt-6">
        <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
          <dt className="label text-muted">{copy.pages.contact.phone}</dt>
          <dd className="font-mono text-sm">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="text-muted hover:text-accent"
            >
              {site.phone}
            </a>
          </dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
          <dt className="label text-muted">{copy.pages.contact.based}</dt>
          <dd className="font-mono text-sm text-muted">{copy.person.locationWithTimezone}</dd>
        </div>
      </dl>

      <ul className="mt-10 grid gap-4 border-t border-line pt-6">
        {site.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="label text-muted hover:text-accent"
            >
              {link.label} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
