import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";

const fonts = resolve("node_modules/@excalidraw/excalidraw/dist/prod/fonts");
const npmLicenses = ".vite/license.md";

function bundledAssets(): Plugin {
  let outDir = "dist";
  const copy = () => {
    cpSync(fonts, resolve(outDir, "fonts"), { recursive: true });
    const generated = resolve(outDir, npmLicenses);
    const npm = existsSync(generated) ? "\n" + readFileSync(generated, "utf8") : "";
    writeFileSync(resolve(outDir, "THIRD_PARTY_LICENSES"), readFileSync("licenses/bundled.txt", "utf8") + npm);
    rmSync(resolve(outDir, ".vite"), { recursive: true, force: true });
  };
  return {
    name: "bundled-assets",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    configureServer(server) {
      server.httpServer?.once("listening", copy);
    },
    writeBundle: copy,
  };
}

export default defineConfig({
  plugins: [react(), crx({ manifest }), bundledAssets()],
  build: { license: { fileName: npmLicenses } },
});
