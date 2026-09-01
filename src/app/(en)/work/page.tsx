import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/work";
import { getCopy } from "@/content/copy";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.work.title,
  description: copy.meta.work.description,
};

export default function Page() {
  return <WorkPage copy={copy} locale="en" />;
}
