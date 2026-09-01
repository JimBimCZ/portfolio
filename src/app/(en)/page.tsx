import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { getCopy } from "@/content/copy";
import { alternatesFor } from "@/content/metadata";

export const metadata: Metadata = {
  alternates: alternatesFor("/"),
};

export default function Home() {
  return <HomePage copy={getCopy("en")} locale="en" />;
}
