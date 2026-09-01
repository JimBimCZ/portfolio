import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/work";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.work.title,
  description: copy.meta.work.description,
  alternates: alternatesFor("/work", "cs"),
};

export default function CzechWork() {
  return <WorkPage copy={copy} locale="cs" />;
}
