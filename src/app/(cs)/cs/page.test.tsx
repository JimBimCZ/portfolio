import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import CzechHome from "./page";

const copy = getCopy("cs");

test("leads with the Czech tagline", () => {
  render(<CzechHome />);

  expect(
    screen.getByRole("heading", { level: 1, name: copy.person.tagline }),
  ).toBeInTheDocument();
});
