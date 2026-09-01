import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { counterpart, getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

export const metadata: Metadata = {
  alternates: { ...alternatesFor("/"), canonical: counterpart("/") },
};

export default function CzechHome() {
  return <HomePage copy={getCopy("cs")} locale="cs" />;
}
