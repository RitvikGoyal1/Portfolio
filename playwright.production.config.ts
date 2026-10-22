import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "forma-production.spec.ts",
    "world-device.spec.ts",
    "project-media.spec.ts",
    "deployments.spec.ts",
  ],
  workers: 1,
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:4173", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: [
    {
      command:
        "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: true,
    },
    {
      command:
        "node node_modules/vite/bin/vite.js preview --outDir dist-signature --host 127.0.0.1 --port 4174",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: true,
    },
  ],
});
