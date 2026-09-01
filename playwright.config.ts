import { defineConfig, devices } from "@playwright/test";

const port = 3210;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Playwright's automatic default is half the machine's logical CPUs (8 on
  // a 16-core box here), which assumes the whole machine is free. It isn't:
  // this machine routinely has a real browser, MCP tooling and other repos'
  // dev/test processes running alongside this suite. Forcing 16 workers
  // (all cores, zero headroom for the Next server itself) reliably produced
  // a real 30s test timeout and stretched total suite time from ~20s to
  // ~90s; 4 and 8 workers were both 100% green across many runs with
  // near-identical wall time (4: 12-23s, 8: 15-27s). Pinning a lower,
  // explicit count trades nothing measurable for headroom against whatever
  // else is running.
  workers: 4,
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
