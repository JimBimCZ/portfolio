import type { Metadata } from "next";
import { ProjectRow } from "@/components/project-row";
import { getCopy } from "@/content/copy";
import { localiseProjects } from "@/content/localise";

const copy = getCopy("en");
const projects = localiseProjects(copy);

export const metadata: Metadata = {
  title: copy.meta.work.title,
  description: copy.meta.work.description,
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        {copy.pages.work.title}
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">{copy.pages.work.lede}</p>
      <ul className="mt-14 border-b border-line">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} copy={copy} />
        ))}
      </ul>
      <p className="label mt-8 text-muted">{copy.pages.work.more}</p>
    </div>
  );
}
