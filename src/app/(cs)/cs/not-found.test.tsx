import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import CzechNotFound from "./not-found";

const copy = getCopy("cs");

test("sends the reader back to the Czech home page", () => {
  render(<CzechNotFound />);

  expect(screen.getByText(copy.pages.notFound.title)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: copy.pages.notFound.back }),
  ).toHaveAttribute("href", "/cs");
});
