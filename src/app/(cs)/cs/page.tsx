import { getCopy } from "@/content/copy";

export default function CzechHome() {
  const copy = getCopy("cs");

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.person.tagline}
      </h1>
    </div>
  );
}
