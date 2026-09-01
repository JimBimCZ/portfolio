import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/pages/project";
import { getCopy } from "@/content/copy";
import { localiseProject } from "@/content/localise";
import { projects } from "@/content/projects";

const copy = getCopy("en");

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function Page(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = localiseProject(slug, copy);

  if (!project) notFound();

  return <ProjectPage project={project} copy={copy} locale="en" />;
}
