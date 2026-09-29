import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "Scribble",
  version: pkg.version,
  description: "Draw on any web page.",
  permissions: ["activeTab", "scripting", "storage"],
  background: { service_worker: "src/background.ts", type: "module" },
  action: { default_title: "Scribble" },
  web_accessible_resources: [{ resources: ["fonts/*"], matches: ["<all_urls>"] }],
  commands: {
    _execute_action: { suggested_key: { default: "Alt+Shift+D" } },
  },
});
