<p align="center">
  <img src="logo.svg" width="96" alt="Scribble logo">
</p>

<h1 align="center">Scribble</h1>

<p align="center">
  Mark up the web. Hand-drawn notes, arrows and diagrams that stay pinned to the page and are there when you come back.
</p>

<p align="center">
  <a href="https://github.com/Lusan-sapkota/Scribble/releases/latest"><img src="https://img.shields.io/github/v/release/Lusan-sapkota/Scribble?color=6965db" alt="Latest release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/Lusan-sapkota/Scribble?color=6965db" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/manifest-v3-6965db" alt="Manifest V3">
  <img src="https://img.shields.io/badge/browser-Chrome%20%7C%20Edge%20%7C%20Brave-6965db" alt="Chromium browsers">
  <a href="https://github.com/excalidraw/excalidraw"><img src="https://img.shields.io/badge/inspired%20by-Excalidraw-6965db" alt="Inspired by Excalidraw"></a>
</p>

Scribble is a Chrome extension that places an Excalidraw canvas over the page you're on. Sketch, add shapes, arrows, text and sticky notes, or paste a Mermaid diagram, right on top of any website. Drawings scroll with the page and come back when you revisit it.

Inspired by [Excalidraw](https://excalidraw.com), and built on its open-source editor. Scribble is an independent project and is not affiliated with Excalidraw.

## Features

- Toggle from the toolbar icon or **Alt+Shift+D**
- The full Excalidraw toolset: shapes, arrows, freehand, text, sticky notes, images, frames, lasso selection, bucket fill, laser pointer and Mermaid to Excalidraw
- **Draw mode** captures the mouse. **View mode** keeps your drawings visible while the page works normally. Toggle or press **Esc** to switch.
- Drawings are anchored to the page and scroll with it
- Saved per page (URL without the `#hash`) and restored when you open Scribble on that page again
- Follows the page's light or dark theme
- Clear page with undo

## Privacy and footprint

- Nothing runs until you click the icon. There are no content scripts on page load, no background timers and no network requests.
- Permissions are limited to `activeTab`, `scripting` and `storage`, with no access to all your sites.
- Drawings stay on your device in `chrome.storage.local`. There is no account, no sync, no analytics and no backend.
- Fonts and assets are bundled, so nothing loads from a CDN.

## Install

### From a release

1. Download `scribble-vX.Y.Z.zip` from the [latest release](https://github.com/Lusan-sapkota/Scribble/releases/latest) and unzip it.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the unzipped folder, the one that contains `manifest.json`.
5. Pin Scribble from the puzzle-piece menu, open any website and click the icon.

### From source

Requirements: Node 22+ and pnpm.

```bash
pnpm install
pnpm build
```

Then load the `dist/` folder with **Load unpacked** as above.

## Usage

| Action | How |
| --- | --- |
| Open Scribble / switch draw ↔ view | Toolbar icon or **Alt+Shift+D** |
| Back to view mode | **Esc** (with nothing selected) |
| Clear the page | Trash button, top right |
| Undo / redo | Buttons top left, or **Ctrl+Z** / **Ctrl+Shift+Z** |

Switching to view mode on an empty page removes Scribble from the page completely. The shortcut can be changed at `chrome://extensions/shortcuts`.

Scribble can't run on `chrome://` pages, the Chrome Web Store or the built-in PDF viewer. Chrome doesn't allow extensions there.

## Development

```bash
pnpm dev        # dev build with HMR; load dist/ as unpacked
pnpm build      # production build to dist/
pnpm typecheck  # tsc --noEmit
pnpm zip        # production build + scribble-v<version>.zip for a release
```

Built with Vite, React, TypeScript, [`@crxjs/vite-plugin`](https://github.com/crxjs/chrome-extension-tools) and [`@excalidraw/excalidraw`](https://www.npmjs.com/package/@excalidraw/excalidraw), as a Manifest V3 extension.

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

[MIT](LICENSE) © Lusan Sapkota

Scribble bundles Excalidraw (MIT), its fonts (SIL OFL 1.1, MIT, and Liberation Sans under GPL v2 with font exceptions) and other open-source npm packages. The build writes their full license texts to `THIRD_PARTY_LICENSES` in `dist/` and in every release zip. The source for the Excalidraw and font section is [`licenses/bundled.txt`](licenses/bundled.txt).
