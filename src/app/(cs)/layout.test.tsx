import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import CzechRootLayout, { metadata } from "./layout";

// next/font/google is compiled away by the Next plugin at build time; under
// Vitest the imported loaders are plain objects, so they are stubbed here.
vi.mock("next/font/google", () => ({
  Schibsted_Grotesk: () => ({ variable: "--font-schibsted" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains" }),
}));

const copy = getCopy("cs");

// The layout renders a whole document, so it is inspected as an element tree
// rather than mounted: jsdom cannot host an <html> element inside a container.
test("marks the document as Czech", () => {
  const props: Parameters<typeof CzechRootLayout>[0] = {
    children: null,
    params: Promise.resolve({}),
  };

  const html = CzechRootLayout(props);

  expect(html.type).toBe("html");
  expect(html.props.lang).toBe("cs");
});

test("titles and describes the page in Czech", () => {
  expect(metadata.title).toEqual({
    default: copy.meta.home.title,
    template: copy.meta.titleTemplate,
  });
  expect(metadata.description).toBe(copy.meta.home.description);
});
