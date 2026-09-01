import type { Metadata } from "next";
import { PrivacyPage } from "@/components/pages/privacy";
import { getCopy } from "@/content/copy";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.privacy.title,
  description: copy.meta.privacy.description,
};

export default function Page() {
  return <PrivacyPage copy={copy} locale="en" />;
}
