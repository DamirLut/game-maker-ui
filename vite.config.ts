import { resolve } from "node:path";
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    libAssetsPlugin({
      name: "[name].[ext]",
      outputPath: "assets",
    }),
  ],
  publicDir: false,
  resolve: {
    alias: {
      "#": resolve(__dirname, "src"),
      "#lib": resolve(__dirname, "src/lib"),
      "#components": resolve(__dirname, "src/components"),
      "#styles": resolve(__dirname, "src/styles"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        styles: resolve(__dirname, "src/styles.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (entryName === "styles") {
          return format === "es" ? "styles.mjs" : "styles.cjs";
        }

        return format === "es" ? "index.mjs" : "index.cjs";
      },
      cssFileName: "styles",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
