import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="label text-accent">{site.status}</p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        Email is the fastest way to reach me.
      </h1>

      <a
        href={`mailto:${site.email}`}
        className="mt-10 inline-block border-b border-accent pb-1 font-mono text-lg text-accent hover:opacity-80"
      >
        {site.email}
      </a>

      <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted">
        Tell me what you are building and what is in the way. I read everything
        and reply within a couple of days.
      </p>

      <ul className="mt-14 grid gap-4 border-t border-line pt-6">
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
