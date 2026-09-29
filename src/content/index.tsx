import { createRoot, type Root } from "react-dom/client";
import css from "@excalidraw/excalidraw/index.css?raw";
import App from "./App";

let mounted: { host: HTMLElement; root: Root } | null = null;
let fontsReady = false;

function loadFonts() {
  if (fontsReady) return;
  fontsReady = true;
  const base = chrome.runtime.getURL("/");
  Object.assign(window, { EXCALIDRAW_ASSET_PATH: base });
  for (const [name, weight] of [["Regular", "400"], ["Medium", "500"], ["SemiBold", "600"], ["Bold", "700"]]) {
    const face = new FontFace("Assistant", `url(${base}fonts/Assistant/Assistant-${name}.woff2)`, { weight });
    document.fonts.add(face);
    face.load().catch(() => {});
  }
}

function mount() {
  loadFonts();
  const host = document.createElement("div");
  host.id = "scribble-host";
  host.dir = "ltr";
  host.style.cssText = "all:initial;position:fixed;inset:0;z-index:2147483647";
  for (const type of ["keydown", "keyup", "keypress"]) {
    host.addEventListener(type, (e) => e.stopPropagation());
  }
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = css
    .replace(/@font-face\{[^}]*\}/g, "")
    .replace(/:root(\[[^\]]+\])/g, ":host($1)")
    .replaceAll(":root", ":host");
  const container = document.createElement("div");
  container.style.cssText = "width:100%;height:100%";
  shadow.append(style, container);
  document.documentElement.append(host);
  const root = createRoot(container);
  root.render(<App />);
  mounted = { host, root };
}

export function onExecute() {
  if (mounted) {
    mounted.root.unmount();
    mounted.host.remove();
    mounted = null;
  } else {
    mount();
  }
}
