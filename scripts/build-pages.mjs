import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const demoDir = resolve(rootDir, "demo-static");
const storybookDir = resolve(rootDir, "storybook-static");
const pagesDir = resolve(rootDir, "pages-static");

await rm(pagesDir, { force: true, recursive: true });
await mkdir(pagesDir, { recursive: true });

await cp(demoDir, pagesDir, { recursive: true });
await cp(storybookDir, resolve(pagesDir, "storybook"), { recursive: true });
await writeFile(resolve(pagesDir, ".nojekyll"), "");
