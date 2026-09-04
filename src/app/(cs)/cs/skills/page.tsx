import type { Metadata } from "next";
import { SkillsPage } from "@/components/pages/skills";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.skills.title,
  description: copy.meta.skills.description,
  alternates: alternatesFor("/skills", "cs"),
};

export default function CzechSkills() {
  return <SkillsPage copy={copy} locale="cs" />;
}
