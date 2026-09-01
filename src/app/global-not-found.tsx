import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { NotFoundPage } from "@/components/pages/not-found";
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

// No layout wraps this page, so the title template has to be applied by hand.
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
      <body className="flex min-h-full flex-col">
        <main className="flex-1">
          <NotFoundPage copy={copy} home="/" />
        </main>
      </body>
    </html>
  );
}
