import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/privacy";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.privacy.title,
  description: copy.meta.privacy.description,
  alternates: alternatesFor("/privacy", "en"),
};

export default function Page() {
  return <PrivacyPage copy={copy} locale="en" />;
}
