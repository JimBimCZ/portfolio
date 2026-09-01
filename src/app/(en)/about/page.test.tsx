import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { AboutPage } from "@/components/pages/about";
import { getCopy } from "@/content/copy";

const copy = getCopy("en");

test("renders every bio paragraph", () => {
  render(<AboutPage copy={copy} />);

  for (const paragraph of copy.person.bio) {
    expect(screen.getByText(paragraph)).toBeInTheDocument();
  }
});

test("lists every role with its employer and dates", () => {
  render(<AboutPage copy={copy} />);

  const entries = within(
    screen.getByRole("list", { name: /experience/i }),
  ).getAllByRole("listitem");
  expect(entries).toHaveLength(copy.person.experience.length);

  copy.person.experience.forEach((job, index) => {
    const entry = within(entries[index]);
    expect(entry.getByRole("heading", { level: 3 })).toHaveTextContent(job.title);
    expect(entry.getByText(job.org)).toBeInTheDocument();
    expect(entry.getByText(job.period)).toBeInTheDocument();
    expect(entry.getByText(job.note)).toBeInTheDocument();
  });
});

test("shows the skill groups from the toolkit", () => {
  render(<AboutPage copy={copy} />);

  for (const [group, value] of copy.person.toolkit) {
    expect(screen.getByText(group)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  }
});
