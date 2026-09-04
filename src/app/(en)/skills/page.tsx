import type { Metadata } from "next";
import { SkillsPage } from "@/components/pages/skills";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.skills.title,
  description: copy.meta.skills.description,
  alternates: alternatesFor("/skills", "en"),
};

export default function Page() {
  return <SkillsPage copy={copy} locale="en" />;
}
