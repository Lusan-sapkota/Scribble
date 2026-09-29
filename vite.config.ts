import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";

const fonts = resolve("node_modules/@excalidraw/excalidraw/dist/prod/fonts");

function excalidrawFonts(): Plugin {
  let outDir = "dist";
  const copy = () => cpSync(fonts, resolve(outDir, "fonts"), { recursive: true });
  return {
    name: "excalidraw-fonts",
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
  plugins: [react(), crx({ manifest }), excalidrawFonts()],
});
