<img src="logo.svg" width="96" alt="Scribble logo">

# Scribble

Draw on any web page. Scribble is a private Chrome extension that places an Excalidraw-style canvas over the current page. You can sketch, add shapes, arrows and text, and annotate. Drawings stay attached to the page as you scroll and come back when you revisit the page.

## Why

I like Excalidraw and think there should be one in the browser. Scribble is meant to stay light. It does nothing and uses no resources until you toggle it on a page. There's no tracking, no account and no backend.

## Features (planned)

- Toggle overlay from the toolbar icon or a keyboard shortcut
- Excalidraw tools: select, rectangle, ellipse, diamond, arrow, line, freehand, text, eraser
- Draw mode / view mode (interact with the page while drawings stay visible)
- Drawings anchored to page coordinates
- Per-page persistence
- Clear page, export as image

## Development

Requirements: Node 22+, pnpm.

```bash
pnpm install
pnpm dev
```

Then open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select `dist/`.

Production build:

```bash
pnpm build
```

## Tech

Vite, React, TypeScript, `@crxjs/vite-plugin`, `@excalidraw/excalidraw`, Manifest V3.

## License

Private and proprietary. All rights reserved.

Third-party components keep their own licenses: Excalidraw (MIT), its bundled fonts (SIL OFL 1.1, MIT, and Liberation Sans under GPL v2 with font exceptions) and all other bundled npm packages. See `THIRD_PARTY_LICENSES`; the build writes the complete notice to `dist/THIRD_PARTY_LICENSES`.
