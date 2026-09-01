import type { site } from "@/content/site";

type Role = (typeof site.experience)[number];

/**
 * A definition-style list over the employment history. Newest first, same
 * order as `site.experience`. No new content — it reads `site.ts`.
 */
export function ExperienceLog({ roles }: { roles: Role[] }) {
  return (
    <dl className="divide-y divide-line-soft border-t border-line">
      {roles.map((role) => (
        <div
          key={`${role.org}-${role.period}`}
          className="grid gap-1 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6"
        >
          <dt className="font-mono text-sm text-dim">{role.period}</dt>
          <dd>
            <p className="font-semibold text-text">{role.role}</p>
            <p className="mt-1 text-sm text-text">{role.org}</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{role.note}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
