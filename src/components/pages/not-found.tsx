import Link from "next/link";
import type { Copy } from "@/content/copy";

/** The body of both 404 pages. `global-not-found.tsx` has to repeat the
 *  document shell — it bypasses layouts — but not this. `home` is the
 *  root URL for the copy's language: "/" for English, "/cs" for Czech. */
export function NotFoundPage({ copy, home }: { copy: Copy; home: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <p className="label text-accent">{copy.pages.notFound.code}</p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.notFound.title}
      </h1>
      <Link href={home} className="label mt-10 inline-block text-muted hover:text-accent">
        {copy.pages.notFound.back}
      </Link>
    </div>
  );
}
