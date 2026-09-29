import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "Scribble",
  version: pkg.version,
  description: "Mark up the web. Hand-drawn notes, arrows and diagrams that stay pinned to the page and are there when you come back.",
  permissions: ["activeTab", "scripting", "storage"],
  background: { service_worker: "src/background.ts", type: "module" },
  icons: { 16: "icons/icon-16.png", 32: "icons/icon-32.png", 48: "icons/icon-48.png", 128: "icons/icon-128.png" },
  action: {
    default_title: "Scribble",
    default_icon: { 16: "icons/icon-16.png", 32: "icons/icon-32.png", 48: "icons/icon-48.png", 128: "icons/icon-128.png" },
  },
  web_accessible_resources: [{ resources: ["fonts/*"], matches: ["<all_urls>"] }],
  commands: {
    _execute_action: { suggested_key: { default: "Alt+Shift+D" } },
  },
});
