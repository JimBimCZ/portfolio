import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { site } from "@/content/site";
import AboutPage from "./page";

test("renders every bio paragraph", () => {
  render(<AboutPage />);

  for (const paragraph of site.bio) {
    expect(screen.getByText(paragraph)).toBeInTheDocument();
  }
});

test("lists every role with its employer and dates", () => {
  render(<AboutPage />);

  const entries = within(
    screen.getByRole("list", { name: /experience/i }),
  ).getAllByRole("listitem");
  expect(entries).toHaveLength(site.experience.length);

  site.experience.forEach((job, index) => {
    const entry = within(entries[index]);
    expect(entry.getByRole("heading", { level: 3 })).toHaveTextContent(job.role);
    expect(entry.getByText(job.org)).toBeInTheDocument();
    expect(entry.getByText(job.period)).toBeInTheDocument();
    expect(entry.getByText(job.note)).toBeInTheDocument();
  });
});

test("shows the skill groups from the toolkit", () => {
  render(<AboutPage />);

  for (const [group, value] of site.skills) {
    expect(screen.getByText(group)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  }
});
