import { ExperienceLog } from "@/components/experience-log";
import type { Copy, Locale } from "@/content/copy";

/**
 * The employment history on a page of its own. It renders `ExperienceLog`,
 * the same component the home page's track-record section uses — `/about`
 * used to carry a second, hand-rolled copy of the same list, which is gone.
 */
export function ExperiencePage({ copy, locale }: { copy: Copy; locale: Locale }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.experience.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        {copy.pages.experience.lede}
      </p>
      <div className="mt-14">
        <ExperienceLog roles={copy.person.experience} locale={locale} />
      </div>
    </div>
  );
}
