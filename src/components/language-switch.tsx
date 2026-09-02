"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { counterpart } from "@/content/copy";
import type { Copy } from "@/content/copy";

/**
 * Takes the strings it renders rather than the whole dictionary, for the same
 * reason as `SiteHeader`: it is a Client Component, so every prop it takes is
 * serialised into the flight payload of every page on the site.
 */
export function LanguageSwitch({
  languageSwitch,
}: {
  languageSwitch: Copy["ui"]["languageSwitch"];
}) {
  const pathname = usePathname();
  const inCzech = pathname === "/cs" || pathname.startsWith("/cs/");
  const other = counterpart(pathname);

  return (
    <nav aria-label={languageSwitch.label}>
      <ul className="flex items-center gap-2">
        <Item code="EN" current={!inCzech} href={other} name={languageSwitch.en} lang="en" />
        <Item code="CS" current={inCzech} href={other} name={languageSwitch.cs} lang="cs" />
      </ul>
    </nav>
  );
}

function Item({
  code,
  current,
  href,
  name,
  lang,
}: {
  code: string;
  current: boolean;
  href: string;
  name: string;
  lang: string;
}) {
  if (current) {
    return (
      <li>
        <span aria-current="true" className="label text-accent">
          {code}
        </span>
      </li>
    );
  }
  return (
    <li>
      <Link
        href={href}
        hrefLang={lang}
        lang={lang}
        className="label text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>{code}</span>
        <span className="sr-only">{name}</span>
      </Link>
    </li>
  );
}
