import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCopy } from "@/content/copy";
import { site } from "@/content/site";
import "../globals.css";

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
  metadataBase: new URL(site.url),
  title: {
    default: copy.meta.home.title,
    template: copy.meta.titleTemplate,
  },
  description: copy.meta.home.description,
  openGraph: {
    title: copy.meta.home.title,
    description: copy.meta.home.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: copy.person.ogImageAlt,
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader
          nav={copy.ui.nav}
          navLabel={copy.ui.navLabel}
          status={copy.person.status}
          locale="en"
        />
        <main className="flex-1">{children}</main>
        <SiteFooter privacyLabel={copy.ui.privacy} locale="en" />
      </body>
    </html>
  );
}
