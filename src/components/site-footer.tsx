import Link from "next/link";
import { localePrefix, type Copy, type Locale } from "@/content/copy";
import { site } from "@/content/site";

export function SiteFooter({ copy, locale }: { copy: Copy; locale: Locale }) {
  const prefix = localePrefix(locale);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${site.email}`}
          className="label text-muted hover:text-accent"
        >
          {site.email}
        </a>
        <ul className="flex gap-6">
          {site.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="label text-muted hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href={`${prefix}/privacy`}
              className="label text-muted hover:text-accent"
            >
              {copy.ui.privacy}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
