import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/pages/project";
import { getCopy } from "@/content/copy";
import { localiseProject } from "@/content/localise";
import { alternatesFor } from "@/content/metadata";
import { projects } from "@/content/projects";

const copy = getCopy("cs");

// Slugs are the project's identity rather than prose, so they stay English on
// both sides: /work/trader and /cs/work/trader.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/cs/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) return {};

  const path = `/work/${slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: alternatesFor(path, "cs"),
  };
}

export default async function CzechProject(props: PageProps<"/cs/work/[slug]">) {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) notFound();

  return <ProjectPage project={project} copy={copy} locale="cs" />;
}
