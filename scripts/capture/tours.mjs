/**
 * One scripted tour per app. Videos loop on the card, so keep them tight —
 * the plan's target is ~12 seconds. Recording starts with the browser
 * context, so a live deployment's own cold-load time is baked into every
 * capture and this project deliberately has no ffmpeg dependency to trim it
 * back out afterwards. ~16 seconds (trader, the slowest of the five, after
 * two rounds of cuts from an original 51s) was accepted as the practical
 * floor without adding an encoder.
 *
 * A tour can also export `prepare(page)`, which runs once before the poster
 * frame is captured (and before `run`). Use it when the resting state is a
 * bad first impression — trader's untouched home screen has an empty
 * positions table and an empty performance chart, which undersells it badly
 * — to leave the app populated before the still is taken. Apps whose resting
 * state is already good (games-db, my-movies, the two sign-in screens) don't
 * define one.
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
    async prepare(page) {
      await maybe(async () => {
        // The quantity field's placeholder is "0" — "UNITS" is the column
        // label above it, not placeholder text. Its accessible name is the
        // reliable thing to key off; it survives a copy change that a
        // placeholder-based locator wouldn't.
        await page.getByLabel("Ticker to trade").fill("AAPL");
        await page.getByLabel("Quantity to trade").fill("5");
        await page.getByTestId("buy-button").click();
        // The fill confirmation depends on a live-priced trade round trip,
        // which on a cold serverless instance can take a few seconds — wait
        // for the dialog itself rather than guessing with a fixed delay, so
        // a slow trade still lands before the poster is taken.
        await page.getByRole("button", { name: "Done" }).waitFor({ state: "visible", timeout: 8_000 });
        await page.getByRole("button", { name: "Done" }).click();
        // The Positions/Allocation panels refetch right after the dialog
        // closes and briefly still show the pre-trade empty state before
        // they catch up — give that refetch time to land before the poster
        // is taken, or the still can show "0 open" despite a real position.
        await settle(page, 2500);
      });
    },
    async run(page) {
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
  // legal sits behind a real email/password sign-in. LEGAL_DEMO_EMAIL and
  // LEGAL_DEMO_PASSWORD must be set before running this capture: without
  // them the poster is taken at the sign-in screen, overwriting the
  // restored screenshot of a completed NDA with an empty login form again
  // (see the fix report for 2026-08-31's whole-branch review). Do not run
  // `npm run capture -- legal` until those are set and a demo account
  // exists.
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
  // work-planner is OAuth-only (Google, GitHub) — there is no email/password
  // form on its sign-in screen, so no demo account could ever drive it past
  // that point. The poster and video are the sign-in screen itself.
  "work-planner": {
    url: "https://work-planner-seven.vercel.app",
  },
};
