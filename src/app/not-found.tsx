import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <p className="label text-accent">404</p>
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        That page does not exist.
      </h1>
      <Link href="/" className="label mt-10 inline-block text-muted hover:text-accent">
        ← Back home
      </Link>
    </div>
  );
}
