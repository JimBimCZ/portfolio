import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { NotFoundPage } from "./not-found";

const copy = getCopy("en");

test("names the status and offers a way back", () => {
  render(<NotFoundPage copy={copy} home="/" />);

  expect(screen.getByText(copy.pages.notFound.code)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 1, name: copy.pages.notFound.title }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: copy.pages.notFound.back }),
  ).toHaveAttribute("href", "/");
});
