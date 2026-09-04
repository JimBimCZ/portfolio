import type { Metadata } from "next";
import { ExperiencePage } from "@/components/pages/experience";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.experience.title,
  description: copy.meta.experience.description,
  alternates: alternatesFor("/experience", "cs"),
};

export default function CzechExperience() {
  return <ExperiencePage copy={copy} locale="cs" />;
}
