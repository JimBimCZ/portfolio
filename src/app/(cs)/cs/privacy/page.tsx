import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/privacy";
import { counterpart, getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.privacy.title,
  description: copy.meta.privacy.description,
  alternates: { ...alternatesFor("/privacy"), canonical: counterpart("/privacy") },
};

export default function CzechPrivacy() {
  return <PrivacyPage copy={copy} locale="cs" />;
}
