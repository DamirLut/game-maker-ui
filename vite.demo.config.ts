import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "./",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "#": resolve(__dirname, "src"),
      "#lib": resolve(__dirname, "src/lib"),
      "#components": resolve(__dirname, "src/components"),
      "#styles": resolve(__dirname, "src/styles"),
      "#icons": resolve(__dirname, "src/assets/icons"),
    },
  },
  build: {
    outDir: "demo-static",
    emptyOutDir: true,
  },
});
