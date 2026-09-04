import { SkillMatrix } from "@/components/skill-matrix";
import type { Copy, Locale } from "@/content/copy";
import { localiseSkills } from "@/content/localise";

/**
 * The skill matrix on a page of its own. The home page shows the same matrix
 * above the track record and links here; both render `localiseSkills(copy)`,
 * so there is one source for what the matrix says.
 */
export function SkillsPage({ copy, locale }: { copy: Copy; locale: Locale }) {
  const groups = localiseSkills(copy);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.skills.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{copy.pages.skills.lede}</p>
      <div className="mt-14">
        <SkillMatrix groups={groups} locale={locale} />
      </div>
    </div>
  );
}
