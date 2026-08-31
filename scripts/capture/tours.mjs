/**
 * One scripted tour per app. Keep them under ~12 seconds: the card loops them.
 * A tour shows the app working — Trader's untouched home screen has an empty
 * positions table and an empty performance chart, which undersells it badly.
 *
 * URLs here must match `liveUrl` in src/content/projects.ts, which is the
 * source of truth for where each app is deployed.
 */
const settle = (page, ms = 1200) => page.waitForTimeout(ms);

async function maybe(action) {
  try {
    await action();
  } catch {
    // A tour is a nice-to-have; never fail a capture because a selector moved.
  }
}

export const tours = {
  trader: {
    url: "https://trader-jimbimczs-projects.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.getByPlaceholder("UNITS").fill("5");
        await page.getByRole("button", { name: "Buy" }).click();
        await settle(page, 2500); // positions table and allocation fill in
      });
      await maybe(async () => {
        await page.getByPlaceholder(/Ask or instruct/i).fill("How is my portfolio doing?");
        await page.getByRole("button", { name: "Send" }).click();
        await settle(page, 3500);
      });
    },
  },
  "games-db": {
    url: "https://games-db-phi.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.getByRole("link", { name: "Top Sellers" }).first().click();
        await settle(page, 2000);
      });
      await maybe(async () => {
        await page.mouse.wheel(0, 900);
        await settle(page, 1500);
      });
    },
  },
  "my-movies": {
    url: "https://my-movies-plum.vercel.app",
    async run(page) {
      await maybe(async () => {
        await page.mouse.wheel(0, 700);
        await settle(page, 1500);
      });
      await maybe(async () => {
        await page.getByRole("link", { name: "Search" }).click();
        await page.getByRole("searchbox").fill("dune");
        await settle(page, 2500);
      });
    },
  },
  // legal and work-planner sit behind sign-in. Their tours log in with the demo
  // account first; until those accounts exist, the tour is the sign-in screen.
  legal: {
    url: "https://legal-seven-zeta.vercel.app",
    async run(page) {
      const email = process.env.LEGAL_DEMO_EMAIL;
      const password = process.env.LEGAL_DEMO_PASSWORD;
      if (!email || !password) return;
      await maybe(async () => {
        await page.getByLabel("Email").fill(email);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Sign in" }).click();
        await settle(page, 3000);
      });
    },
  },
  "work-planner": {
    url: "https://work-planner-seven.vercel.app",
    async run(page) {
      const email = process.env.PLANNER_DEMO_EMAIL;
      const password = process.env.PLANNER_DEMO_PASSWORD;
      if (!email || !password) return;
      await maybe(async () => {
        await page.getByLabel("Email").fill(email);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: /sign in/i }).click();
        await settle(page, 3000);
      });
    },
  },
};
