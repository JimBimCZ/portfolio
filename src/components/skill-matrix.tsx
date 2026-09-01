import Link from "next/link";
import { getProject } from "@/content/projects";
import type { SkillGroup } from "@/content/localise";

/**
 * Every skill names the shipped projects that prove it. An evidence tag opens
 * the live deployment when one exists, and falls back to the case study page
 * when it does not — so a tag is never a dead end.
 */
export function SkillMatrix({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="label text-muted">{group.title}</h3>
          <table className="mt-4 w-full border-collapse text-left">
            <tbody>
              {group.skills.map((skill) => (
                <tr key={skill.name} className="border-t border-line-soft">
                  <td className="py-4 pr-6 align-top">
                    <p className="text-text">{skill.name}</p>
                    <p className="mt-1 text-sm text-muted">{skill.detail}</p>
                  </td>
                  <td className="py-4 align-top">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2">
                      {skill.evidence.map((slug) => {
                        const project = getProject(slug);
                        const href = project?.liveUrl ?? `/work/${slug}`;
                        const external = Boolean(project?.liveUrl);
                        return (
                          <li key={slug}>
                            <Link
                              href={href}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noopener noreferrer" : undefined}
                              className="label text-muted hover:text-accent"
                            >
                              {slug}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
