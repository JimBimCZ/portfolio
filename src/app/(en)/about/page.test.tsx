import { render, screen } from "@testing-library/react";
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

// The employment history lives on /experience now. It used to be duplicated
// here as a second hand-rolled list of the same dictionary entries, which is
// what this asserts is gone — /experience owns it, via ExperienceLog.
test("no longer carries its own copy of the employment history", () => {
  render(<AboutPage copy={copy} />);

  for (const job of copy.person.experience) {
    expect(screen.queryByText(job.note)).not.toBeInTheDocument();
  }
});

test("shows the skill groups from the toolkit", () => {
  render(<AboutPage copy={copy} />);

  for (const [group, value] of copy.person.toolkit) {
    expect(screen.getByText(group)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  }
});
