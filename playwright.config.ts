import os from "node:os";
import { defineConfig, devices } from "@playwright/test";

const port = 3210;

// Playwright's own default is max(1, cpuCount / 2), which already scales
// down correctly on a small machine (a 2-core CI runner gets 1 worker). The
// problem found on this 16-core dev box was the other end: forcing
// --workers=16 (all cores, zero headroom for the Next server itself)
// reliably produced a real expect-timeout and stretched total suite time
// from ~20s to ~90s, whereas the untouched default (8 here) ran green 71
// times today against only 7 for a flat 4 — the evidence backs "don't
// oversubscribe the machine", not a specific number. So cap the default
// rather than replace it: never exceed 8, but fall through to Playwright's
// own smaller number on anything smaller than this box.
const workers = Math.max(1, Math.min(8, Math.floor(os.cpus().length / 2)));

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against a production build. `next dev` refuses to start when
  // another dev server is already running on this project, which would make
  // the suite fail depending on what else is open.
  webServer: {
    command: `npm run build && npx next start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
