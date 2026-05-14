import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "#": resolve(__dirname, "src"),
      "#lib": resolve(__dirname, "src/lib"),
      "#components": resolve(__dirname, "src/components"),
      "#styles": resolve(__dirname, "src/styles"),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      "storybook-static",
      "demo-static",
      ".storybook",
    ],
    browser: {
      enabled: true,
      headless: true,
      api: {
        host: "127.0.0.1",
      },
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
