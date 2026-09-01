import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.contact.title,
  description: copy.meta.contact.description,
  alternates: alternatesFor("/contact"),
};

export default function Page() {
  return <ContactPage copy={copy} />;
}
