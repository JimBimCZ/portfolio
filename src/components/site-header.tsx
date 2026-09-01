"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePrefix, type Copy, type Locale } from "@/content/copy";
import { site } from "@/content/site";
import { LanguageSwitch } from "./language-switch";

/**
 * Takes the strings it renders rather than the whole dictionary: it is a
 * Client Component, so every prop is serialised into the flight payload of
 * every page on the site.
 */
export function SiteHeader({
  nav,
  navLabel,
  status,
  locale,
  languageSwitch,
}: {
  nav: Copy["ui"]["nav"];
  navLabel: string;
  status: string;
  locale: Locale;
  languageSwitch: Copy["ui"]["languageSwitch"];
}) {
  const pathname = usePathname();
  const prefix = localePrefix(locale);

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
        <Link href={prefix || "/"} className="label text-text hover:text-accent">
          {site.name}
        </Link>
        {/*
          The status/email cluster only fits once the row has room for the
          longer Czech nav and language switch too — reveal it at the width
          where that holds (measured empirically), not at a generic
          breakpoint that happens to work for English alone.
        */}
        <div className="hidden items-center gap-6 min-[860px]:flex">
          <p className="label flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-live" aria-hidden />
            {status}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="label text-muted hover:text-accent"
          >
            {site.email}
          </a>
        </div>
        <nav aria-label={navLabel}>
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
                    {nav[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <LanguageSwitch languageSwitch={languageSwitch} />
      </div>
    </header>
  );
}
