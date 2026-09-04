import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseArchitecture } from "@/content/localise";
import { AnswerPipeline } from "./answer-pipeline";

function renderFor(locale: "en" | "cs" = "en") {
  const pipeline = localiseArchitecture("secure-llm", getCopy(locale)).pipeline!;
  render(<AnswerPipeline pipeline={pipeline} />);
  return pipeline;
}

test("heads the section with the project's own title for it", () => {
  const pipeline = renderFor();
  expect(
    screen.getByRole("heading", { level: 3, name: pipeline.title }),
  ).toBeInTheDocument();
});

// The order is the whole point of the component, so it is asserted against
// the list the DOM actually produces rather than by looking each step up.
test("renders every step, in order, with what happens there", () => {
  const pipeline = renderFor();
  const steps = screen.getAllByTestId("pipeline-step");

  expect(steps).toHaveLength(pipeline.steps.length);
  steps.forEach((element, index) => {
    const step = pipeline.steps[index];
    expect(within(element).getByText(step.name)).toBeInTheDocument();
    expect(within(element).getByText(step.detail)).toBeInTheDocument();
  });
});

test("reads it as an ordered list, so the sequence survives without the styling", () => {
  renderFor();
  expect(screen.getByRole("list")).toBeInTheDocument();
  expect(screen.getByRole("list").tagName).toBe("OL");
});

test("branches exactly the steps the request can stop at", () => {
  const pipeline = renderFor();
  const guards = pipeline.steps.filter((step) => step.guard);

  expect(screen.getAllByTestId("pipeline-branch")).toHaveLength(guards.length);
  for (const step of guards) {
    const element = screen
      .getAllByTestId("pipeline-step")
      .find((node) => within(node).queryByText(step.name));
    expect(within(element!).getByTestId("pipeline-branch")).toBeInTheDocument();
  }
});

// Module paths are facts. Under `lang="cs"` they are an English run inside
// Czech prose and are marked as one, the same rule the diagram's protocols
// and the experience log's job titles follow.
test("marks the module paths as English, and translates only the prose", () => {
  const pipeline = renderFor("cs");
  const first = screen.getAllByTestId("pipeline-step")[0];

  expect(within(first).getByText(pipeline.steps[0].name)).toHaveAttribute("lang", "en");
  expect(within(first).getByText(pipeline.steps[0].detail)).not.toHaveAttribute("lang");
});
