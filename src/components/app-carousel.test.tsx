import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { getCopy } from "@/content/copy";
import { localiseCarousel } from "@/content/localise";
import { AppCarousel } from "./app-carousel";

vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

const copy = getCopy("en");
const carouselProjects = localiseCarousel(copy);

test("opens on the first project", () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[0].title,
  );
});

test("the next control advances the active slide", async () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[1].title,
  );
});

test("the previous control wraps around from the first slide", async () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("button", { name: /previous/i }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects.at(-1)!.title,
  );
});

test("a tab selects its project directly", async () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("tab", { name: carouselProjects[2].title }));
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[2].title,
  );
});

test("arrow keys move between slides once the tabs have focus", async () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("tab", { name: carouselProjects[0].title }));
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[1].title,
  );
});

test("arrow keys keep moving the same way DOM focus follows the selected tab", async () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("tab", { name: carouselProjects[0].title }));
  await userEvent.keyboard("{ArrowRight}{ArrowRight}");
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[2].title,
  );
  expect(screen.getByRole("tab", { name: carouselProjects[2].title })).toHaveFocus();
});

test("exactly one video plays, however far you scroll the carousel", async () => {
  const { container } = render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  await userEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(container.querySelectorAll("video").length).toBe(1);
});

// The touch handlers sit on the carousel's swipeable track, a plain div one
// level inside the labelled region (it lost its own role/label so the region
// wouldn't announce its name twice — see app-carousel.tsx). A touch event
// only reaches an ancestor's handler by bubbling, so these fire on the
// visible card itself, same as a real finger would touch it, rather than on
// the region landmark that wraps the whole component.

test("a left swipe advances to the next slide", () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  const region = screen.getByRole("region", { name: "Deployed applications" });
  const activeCard = within(region).getByRole("link", {
    name: new RegExp(carouselProjects[0].title),
  });
  fireEvent.touchStart(activeCard, { touches: [{ clientX: 200 }] });
  fireEvent.touchEnd(activeCard, { changedTouches: [{ clientX: 100 }] });
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[1].title,
  );
});

test("a right swipe returns to the previous slide", () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  const region = screen.getByRole("region", { name: "Deployed applications" });
  const activeCard = within(region).getByRole("link", {
    name: new RegExp(carouselProjects[0].title),
  });
  fireEvent.touchStart(activeCard, { touches: [{ clientX: 100 }] });
  fireEvent.touchEnd(activeCard, { changedTouches: [{ clientX: 200 }] });
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects.at(-1)!.title,
  );
});

test("a short touch that is not a real swipe does not change the slide", () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  const region = screen.getByRole("region", { name: "Deployed applications" });
  const activeCard = within(region).getByRole("link", {
    name: new RegExp(carouselProjects[0].title),
  });
  fireEvent.touchStart(activeCard, { touches: [{ clientX: 100 }] });
  fireEvent.touchEnd(activeCard, { changedTouches: [{ clientX: 110 }] });
  expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
    carouselProjects[0].title,
  );
});

// A card without a deployment falls back to its repository, so the assertion
// is that every project goes SOMEWHERE — not that every project is deployed.
test("every project is reachable and links to its deployment or its source", () => {
  render(<AppCarousel projects={carouselProjects} labels={copy.ui.carousel}
      statuses={copy.ui.status} />);
  for (const project of carouselProjects) {
    expect(
      screen.getByRole("link", { name: new RegExp(project.title) }),
    ).toHaveAttribute("href", project.liveUrl ?? project.repo);
  }
});
