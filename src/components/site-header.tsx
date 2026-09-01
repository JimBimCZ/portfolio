"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePrefix, type Copy, type Locale } from "@/content/copy";
import { site } from "@/content/site";

export function SiteHeader({ copy, locale }: { copy: Copy; locale: Locale }) {
  const pathname = usePathname();
  const prefix = localePrefix(locale);

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
        <Link href={prefix || "/"} className="label text-text hover:text-accent">
          {site.name}
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          <p className="label flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-live" aria-hidden />
            {copy.person.status}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="label text-muted hover:text-accent"
          >
            {site.email}
          </a>
        </div>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6">
            {site.nav.map((item) => {
              const href = `${prefix}${item.href}`;
              const active = pathname.startsWith(href);
              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`label transition-colors ${
                      active ? "text-accent" : "text-muted hover:text-text"
                    }`}
                  >
                    {copy.ui.nav[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
