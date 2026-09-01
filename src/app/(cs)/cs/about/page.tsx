import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";
import { counterpart, getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.about.title,
  description: copy.meta.about.description,
  alternates: { ...alternatesFor("/about"), canonical: counterpart("/about") },
};

export default function CzechAbout() {
  return <AboutPage copy={copy} />;
}
