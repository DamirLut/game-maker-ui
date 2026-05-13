import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import svgr from "vite-plugin-svgr";

const currentDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins ??= [];
    config.plugins.push(svgr());

    config.resolve ??= {};
    config.resolve.alias = {
      ...(typeof config.resolve.alias === "object" &&
      !Array.isArray(config.resolve.alias)
        ? config.resolve.alias
        : {}),
      "#": resolve(currentDir, "../src"),
      "#lib": resolve(currentDir, "../src/lib"),
      "#components": resolve(currentDir, "../src/components"),
      "#styles": resolve(currentDir, "../src/styles"),
    };

    return config;
  },
};

export default config;
