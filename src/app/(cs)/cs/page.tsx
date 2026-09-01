import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

export const metadata: Metadata = {
  alternates: alternatesFor("/", "cs"),
};

export default function CzechHome() {
  return <HomePage copy={getCopy("cs")} locale="cs" />;
}
