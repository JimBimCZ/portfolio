import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/privacy";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.privacy.title,
  description: copy.meta.privacy.description,
  alternates: alternatesFor("/privacy", "cs"),
};

export default function CzechPrivacy() {
  return <PrivacyPage copy={copy} locale="cs" />;
}
