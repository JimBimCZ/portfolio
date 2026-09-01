import type { JobCopy, Locale } from "@/content/copy/types";

/**
 * A definition-style list over the employment history. Newest first, same
 * order as `copy.person.experience`. No new content — it reads the dictionary.
 *
 * `title` and `org` are job titles and employer names, which stay English in
 * both locales (the way Czech CVs keep them). Under the Czech tree that is an
 * English run inside a `lang="cs"` document, so it is marked `lang="en"` —
 * `note` stays unmarked because it is translated per locale, and `period` is
 * a date, not language-specific text.
 */
export function ExperienceLog({ roles, locale }: { roles: readonly JobCopy[]; locale: Locale }) {
  const englishRun = locale === "cs" ? "en" : undefined;
  return (
    <dl className="divide-y divide-line-soft border-t border-line">
      {roles.map((role) => (
        <div
          key={`${role.org}-${role.period}`}
          className="grid gap-1 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6"
        >
          <dt className="font-mono text-sm text-dim">{role.period}</dt>
          <dd>
            <p className="font-semibold text-text" lang={englishRun}>
              {role.title}
            </p>
            <p className="mt-1 text-sm text-text" lang={englishRun}>
              {role.org}
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{role.note}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
