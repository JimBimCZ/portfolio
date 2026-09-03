import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseArchitecture } from "@/content/localise";
import { ArchitectureDiagram } from "./architecture-diagram";

function renderFor(slug: string, locale: "en" | "cs" = "en") {
  const copy = getCopy(locale);
  const architecture = localiseArchitecture(slug, copy);
  render(
    <ArchitectureDiagram architecture={architecture} label={copy.architecture.diagramLabel} />,
  );
  return architecture;
}

test("heads every band the project uses", () => {
  const { bands } = renderFor("games-db");
  for (const band of bands) {
    expect(screen.getByRole("heading", { level: 3, name: band.title })).toBeInTheDocument();
  }
});

test("names every node, with its note where it has one", () => {
  const { bands } = renderFor("trader");
  for (const band of bands) {
    for (const node of band.nodes) {
      expect(screen.getByText(node.name)).toBeInTheDocument();
      if (node.note) expect(screen.getByText(node.note)).toBeInTheDocument();
    }
  }
});

// The protocol is the part of an edge a screen reader can get at; the rule and
// the arrow tick are decorative. Losing it would leave the relationships
// invisible to anyone not looking at the picture.
// work-planner deliberately names both a node and an edge "Server Actions" —
// the node is where writes live, the edge is how the browser reaches it — so
// this asserts at least one match rather than exactly one.
test("labels every edge with its protocol, whichever way it runs", () => {
  const { edges } = renderFor("work-planner");
  expect(edges.length).toBe(5);
  const diagram = screen.getByRole("group", { name: "Architecture diagram" });
  for (const edge of edges) {
    expect(within(diagram).getAllByText(edge.protocol).length, edge.protocol)
      .toBeGreaterThan(0);
  }
});

test("gives the diagram an accessible name", () => {
  renderFor("legal");
  expect(screen.getByRole("group", { name: "Architecture diagram" })).toBeInTheDocument();
});

test("lists the decisions in order, each with its reason", () => {
  const { decisions } = renderFor("legal");
  const items = screen.getAllByRole("listitem");
  const text = items.map((item) => item.textContent ?? "");
  for (const decision of decisions) {
    expect(text.some((line) => line.includes(decision.choice))).toBe(true);
    expect(text.some((line) => line.includes(decision.because))).toBe(true);
  }
});

test("reads in Czech under the Czech dictionary", () => {
  renderFor("games-db", "cs");
  expect(screen.getByRole("heading", { level: 3, name: "Klient" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 3, name: "Externí služby" })).toBeInTheDocument();
  // Technology names are facts and stay put in both languages.
  expect(screen.getByText("Postgres (Neon)")).toBeInTheDocument();
});

// No project's edges all run downward between adjacent bands, so this shape
// exists only in the type — but `repeat(0, …)` is invalid CSS and would take
// the whole track list with it, including the `minmax(0, 1fr)` that keeps a
// long node name from widening the page.
test("keeps a usable track list when a project has no gutter edges", () => {
  render(
    <ArchitectureDiagram
      label="Architecture diagram"
      architecture={{
        bands: [
          {
            band: "client",
            title: "Client",
            nodes: [{ id: "next", band: "client", name: "Next.js" }],
          },
          {
            band: "server",
            title: "Server",
            nodes: [{ id: "api", band: "server", name: "app/api" }],
          },
        ],
        edges: [{ from: "client", to: "server", protocol: "GET /api/*" }],
        decisions: [],
      }}
    />,
  );
  const diagram = screen.getByRole("group", { name: "Architecture diagram" });
  expect(diagram.style.gridTemplateColumns).toBe("minmax(0, 1fr)");
  expect(within(diagram).queryAllByTestId("gutter-edge")).toHaveLength(0);
});

test("places each band on its own grid row and each gutter edge in its own lane", () => {
  renderFor("work-planner");
  const diagram = screen.getByRole("group", { name: "Architecture diagram" });
  const bands = within(diagram).getAllByRole("heading", { level: 3 });
  const rows = bands.map((heading) => heading.closest("section")!.style.gridRow);
  expect(rows).toEqual(["1", "3", "5", "7"]);

  // Three of work-planner's five edges are non-adjacent or upward, so each
  // needs a lane of its own — overlapping them would draw one line over another.
  const gutterEdges = within(diagram).getAllByTestId("gutter-edge");
  const lanes = gutterEdges.map((edge) => edge.style.gridColumn);
  expect(new Set(lanes).size).toBe(3);

  // Distinct lanes alone would still pass with an off-by-one in the span, which
  // is what makes a line stop short of the band it connects to. server → S3
  // runs rows 3-7, and Pusher → client and client → S3 both run 1-7; a row span
  // ends one line past its last row, hence the 8.
  expect(gutterEdges.map((edge) => edge.style.gridRow)).toEqual([
    "3 / 8",
    "1 / 8",
    "1 / 8",
  ]);
});
