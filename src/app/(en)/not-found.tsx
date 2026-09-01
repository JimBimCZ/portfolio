import Link from "next/link";
import { getCopy } from "@/content/copy";

export default function NotFound() {
  const copy = getCopy("en");

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <p className="label text-accent">{copy.pages.notFound.code}</p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.notFound.title}
      </h1>
      <Link href="/" className="label mt-10 inline-block text-muted hover:text-accent">
        {copy.pages.notFound.back}
      </Link>
    </div>
  );
}
