import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Link from "next/link";
import { getCopy } from "@/content/copy";
import "./globals.css";

const sans = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const copy = getCopy("en");

export const metadata: Metadata = {
  title: copy.meta.titleTemplate.replace("%s", copy.pages.notFound.code),
  description: copy.pages.notFound.title,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-text">
        <main className="mx-auto max-w-3xl flex-1 px-6 py-32">
          <p className="label text-accent">{copy.pages.notFound.code}</p>
          <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
            {copy.pages.notFound.title}
          </h1>
          <Link
            href="/"
            className="label mt-10 inline-block text-muted hover:text-accent"
          >
            {copy.pages.notFound.back}
          </Link>
        </main>
      </body>
    </html>
  );
}
