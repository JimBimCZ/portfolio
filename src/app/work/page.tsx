import type { Metadata } from "next";
import { ProjectRow } from "@/components/project-row";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects, newest first, with what shipped and what it changed.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
        Here’s my latest work
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted">
        Newest first. Each entry lists what shipped, when, and what it changed.
      </p>
      <ul className="mt-14 border-b border-line">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
      <p className="label mt-8 text-muted">More in progress</p>
    </div>
  );
}
