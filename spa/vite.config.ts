import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const spaRoot = dirname(fileURLToPath(import.meta.url));
const workspace = join(spaRoot, "..");

/** GitHub Pages URL: https://aminramirezvilla-hue.github.io/a-las-brasas-existencias/ */
export const PAGES_BASE = "/a-las-brasas-existencias/";

function pagesExtras(): Plugin {
  return {
    name: "brasas-pages-extras",
    closeBundle() {
      const docs = join(workspace, "docs");
      const index = join(docs, "index.html");
      if (existsSync(index)) {
        copyFileSync(index, join(docs, "404.html"));
      }
      mkdirSync(docs, { recursive: true });
      writeFileSync(join(docs, ".nojekyll"), "");
    },
  };
}

export default defineConfig({
  root: spaRoot,
  base: PAGES_BASE,
  publicDir: join(spaRoot, "public"),
  plugins: [tailwindcss(), viteReact(), pagesExtras()],
  resolve: {
    alias: { "@": join(workspace, "src") },
  },
  build: {
    outDir: join(workspace, "docs"),
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: true,
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react";
          }
        },
      },
    },
  },
});
