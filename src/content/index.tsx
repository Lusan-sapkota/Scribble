import { createRoot, type Root } from "react-dom/client";
import { CaptureUpdateAction, getNonDeletedElements, getSceneVersion } from "@excalidraw/excalidraw";
import type {
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types";
import css from "@excalidraw/excalidraw/index.css?raw";
import App from "./App";

type Mode = "draw" | "view";
type OnChange = NonNullable<ExcalidrawProps["onChange"]>;
type OnScrollChange = NonNullable<ExcalidrawProps["onScrollChange"]>;

const viewCss = `
:host([data-mode=view]) .layer-ui__wrapper, :host([data-mode=view]) .layer-ui__wrapper * { visibility: hidden !important; }
:host([data-mode=view]) * { pointer-events: none !important; }
.zoom-actions, .help-icon, .default-sidebar-trigger, .main-menu-trigger { display: none !important; }
.excalidraw .undo-redo-buttons { position: fixed; top: 1rem; left: 1rem; margin: 0; }
.excalidraw .App-menu__left { margin-top: 1.5rem; }
`;

let mounted: {
  host: HTMLElement;
  shadow: ShadowRoot;
  root: Root;
  key: string;
  initialData: ExcalidrawInitialDataState;
} | null = null;
let loading = false;
let mode: Mode = "draw";
let theme: "light" | "dark" = "light";
let api: ExcalidrawImperativeAPI | null = null;
let savedVersion = -1;
let saveTimer = 0;
let pendingSave: (() => void) | null = null;
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

function pageKey() {
  return "scribble:" + location.origin + location.pathname + location.search;
}

function save(key: string, elements: Parameters<OnChange>[0], files: BinaryFiles) {
  const live = getNonDeletedElements(elements);
  if (!live.length) {
    chrome.storage.local.remove(key).catch(() => {});
    return;
  }
  const used: BinaryFiles = {};
  for (const el of live) {
    if (el.type === "image" && el.fileId && files[el.fileId]) used[el.fileId] = files[el.fileId];
  }
  chrome.storage.local
    .set({ [key]: { elements: live, files: used } })
    .catch((e) => console.warn("Scribble: could not save drawing", e));
}

function flush() {
  clearTimeout(saveTimer);
  pendingSave?.();
  pendingSave = null;
}

const onChange: OnChange = (elements, _, files) => {
  if (!mounted) return;
  const version = getSceneVersion(elements);
  if (version === savedVersion) return;
  savedVersion = version;
  const key = mounted.key;
  pendingSave = () => save(key, elements, files);
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(flush, 500);
};

function syncScroll() {
  api?.updateScene({ appState: { scrollX: -window.scrollX, scrollY: -window.scrollY } });
}

const onScrollChange: OnScrollChange = (scrollX, scrollY, zoom) => {
  if (zoom.value !== 1) {
    api?.updateScene({
      appState: { zoom: { value: 1 as typeof zoom.value }, scrollX: -window.scrollX, scrollY: -window.scrollY },
    });
  } else if (-scrollX !== window.scrollX || -scrollY !== window.scrollY) {
    window.scrollTo({ left: -scrollX, top: -scrollY, behavior: "instant" });
    syncScroll();
  }
};

const keyEvents = ["keydown", "keyup", "keypress"];

const pointerEvents = ["pointerdown", "pointerup"];

function retarget(e: Event) {
  if (mounted && e.target === mounted.host) Object.defineProperty(e, "target", { value: e.composedPath()[0] });
}

function opensModal(e: KeyboardEvent) {
  const k = e.key.toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  return k === "?" || (mod && (k === "/" || k === "o" || (e.shiftKey && (k === "e" || k === "p"))));
}

function zoomsBrowser(e: KeyboardEvent) {
  return (e.ctrlKey || e.metaKey) && ["=", "+", "-", "0"].includes(e.key);
}

function focusCanvas() {
  mounted?.shadow.querySelector<HTMLElement>(".excalidraw-container")?.focus();
}

function onClear() {
  if (api && confirm("Clear all drawings on this page?")) {
    api.updateScene({ elements: [], captureUpdate: CaptureUpdateAction.IMMEDIATELY });
  }
  focusCanvas();
}

function onKeyDown(e: KeyboardEvent) {
  if (opensModal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  if (zoomsBrowser(e)) {
    e.stopPropagation();
    return;
  }
  if (e.key !== "Escape" || mode !== "draw" || !api) return;
  const s = api.getAppState();
  if (Object.keys(s.selectedElementIds).length || s.editingTextElement || s.newElement || s.multiElement) return;
  e.stopPropagation();
  setMode("view");
}

function pageTheme() {
  return pageIsDark() ? "dark" : "light";
}

function pageIsDark() {
  for (const el of [document.body, document.documentElement]) {
    if (!el) continue;
    const [r, g, b, a = 1] = (getComputedStyle(el).backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
    if (a > 0) return 0.299 * r + 0.587 * g + 0.114 * b < 128;
  }
  return getComputedStyle(document.documentElement).colorScheme.includes("dark");
}

function render() {
  if (!mounted) return;
  mounted.root.render(
    <App
      autoFocus={mode === "draw"}
      initialData={mounted.initialData}
      theme={theme}
      onExcalidrawAPI={(a) => (api = a)}
      onChange={onChange}
      onScrollChange={onScrollChange}
      onClear={onClear}
    />,
  );
}

function setMode(next: Mode) {
  if (!mounted) return;
  if (next === "view" && api && !api.getSceneElements().length) return unmount();
  mode = next;
  mounted.host.dataset.mode = next;
  mounted.host.style.pointerEvents = next === "view" ? "none" : "";
  if (next === "view") {
    (mounted.shadow.activeElement as HTMLElement | null)?.blur();
    api?.updateScene({ appState: { selectedElementIds: {} } });
    return;
  }
  if (pageTheme() !== theme) {
    theme = pageTheme();
    render();
  }
  focusCanvas();
}

function adoptModal(shadow: ShadowRoot, node: Node) {
  const { scrollX, scrollY } = window;
  Node.prototype.appendChild.call(document.body, node);
  queueMicrotask(() => {
    if (!(node instanceof Element) || !node.matches(".excalidraw-modal-container, .excalidraw-tooltip")) return;
    const active = document.activeElement;
    shadow.appendChild(node);
    if (active instanceof HTMLElement && node.contains(active)) active.focus({ preventScroll: true });
    window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
  });
  return node;
}

async function mount(next: Mode = "draw") {
  loading = true;
  const key = pageKey();
  const stored = (await chrome.storage.local.get(key))[key] as ExcalidrawInitialDataState | undefined;
  loading = false;
  if (next === "view" && !stored) return;
  loadFonts();
  const host = document.createElement("div");
  host.id = "scribble-host";
  host.dir = "ltr";
  host.style.cssText = "all:initial;position:fixed;inset:0";
  host.popover = "manual";
  for (const type of keyEvents) {
    host.addEventListener(type, (e) => e.stopPropagation());
  }
  host.addEventListener("keydown", onKeyDown, true);
  host.addEventListener("wheel", (e) => e.stopPropagation(), true);
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent =
    css
      .replace(/@font-face\{[^}]*\}/g, "")
      .replace(/:root(\[[^\]]+\])/g, ":host($1)")
      .replaceAll(":root", ":host") + viewCss;
  const container = document.createElement("div");
  container.style.cssText = "width:100%;height:100%";
  shadow.append(style, container);
  document.documentElement.append(host);
  host.showPopover();
  Object.defineProperties(document.body, {
    appendChild: { configurable: true, value: (node: Node) => adoptModal(shadow, node) },
    removeChild: { configurable: true, value: (node: Node) => (node.parentNode?.removeChild(node), node) },
  });
  const activeElement = Object.getOwnPropertyDescriptor(Document.prototype, "activeElement")!.get!;
  Object.defineProperties(document, {
    activeElement: {
      configurable: true,
      get: () => {
        const active = activeElement.call(document);
        return active === host ? (shadow.activeElement ?? host) : active;
      },
    },
    elementFromPoint: {
      configurable: true,
      value: (x: number, y: number) => {
        const hit = Document.prototype.elementFromPoint.call(document, x, y);
        return hit === host ? shadow.elementFromPoint(x, y) : hit;
      },
    },
    querySelector: {
      configurable: true,
      value: (selector: string) => shadow.querySelector(selector) ?? Document.prototype.querySelector.call(document, selector),
    },
  });
  for (const target of [document, window]) {
    const route = (type: string, capture: boolean) => (keyEvents.includes(type) && !capture ? host : target);
    Object.defineProperties(target, {
      addEventListener: {
        configurable: true,
        value: (type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) =>
          EventTarget.prototype.addEventListener.call(
            route(type, typeof options === "boolean" ? options : !!options?.capture),
            type,
            listener,
            options,
          ),
      },
      removeEventListener: {
        configurable: true,
        value: (type: string, listener: EventListenerOrEventListenerObject | null) => {
          for (const capture of [false, true]) {
            EventTarget.prototype.removeEventListener.call(route(type, capture), type, listener, capture);
          }
        },
      },
    });
  }
  for (const type of pointerEvents) window.addEventListener(type, retarget, true);
  window.addEventListener("scroll", syncScroll, { passive: true });
  window.addEventListener("pagehide", flush);
  window.navigation?.addEventListener("currententrychange", onNavigate);
  theme = pageTheme();
  mounted = {
    host,
    shadow,
    root: createRoot(container),
    key,
    initialData: {
      elements: stored?.elements,
      files: stored?.files,
      appState: {
        viewBackgroundColor: "transparent",
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
      },
    },
  };
  setMode(next);
  render();
}

function onNavigate() {
  if (!mounted || pageKey() === mounted.key) return;
  const next = mode;
  unmount();
  mount(next);
}

function unmount() {
  if (!mounted) return;
  flush();
  for (const type of pointerEvents) window.removeEventListener(type, retarget, true);
  window.removeEventListener("scroll", syncScroll);
  window.removeEventListener("pagehide", flush);
  window.navigation?.removeEventListener("currententrychange", onNavigate);
  mounted.root.unmount();
  Reflect.deleteProperty(document.body, "appendChild");
  Reflect.deleteProperty(document.body, "removeChild");
  Reflect.deleteProperty(document, "activeElement");
  Reflect.deleteProperty(document, "elementFromPoint");
  Reflect.deleteProperty(document, "querySelector");
  for (const target of [document, window]) {
    Reflect.deleteProperty(target, "addEventListener");
    Reflect.deleteProperty(target, "removeEventListener");
  }
  mounted.host.remove();
  mounted = null;
  api = null;
  savedVersion = -1;
}

export function onExecute() {
  if (loading) return;
  if (!mounted) mount();
  else setMode(mode === "draw" ? "view" : "draw");
}
