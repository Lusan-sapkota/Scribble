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

Third-party components keep their own licenses. Excalidraw is MIT-licensed (see `THIRD_PARTY_LICENSES`).
