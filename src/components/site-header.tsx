"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="label text-text hover:text-accent">
          {site.name}
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          <p className="label flex items-center gap-2 text-muted">
            <span className="size-1.5 rounded-full bg-live" aria-hidden />
            {site.status}
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
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`label transition-colors ${
                      active ? "text-accent" : "text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
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
