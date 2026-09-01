import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";
import { getCopy } from "@/content/copy";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.about.title,
  description: copy.meta.about.description,
};

export default function Page() {
  return <AboutPage copy={copy} />;
}
