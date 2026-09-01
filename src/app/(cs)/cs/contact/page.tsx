import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";
import { getCopy } from "@/content/copy";

const copy = getCopy("cs");

export const metadata: Metadata = {
  title: copy.meta.contact.title,
  description: copy.meta.contact.description,
};

export default function CzechContact() {
  return <ContactPage copy={copy} />;
}
