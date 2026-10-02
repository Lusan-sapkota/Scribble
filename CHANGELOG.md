# Changelog

All notable changes to Scribble are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-10-02

Fixes for Excalidraw features that broke inside Scribble's Shadow DOM overlay.

### Fixed

- Pressing **Space** once no longer leaves the canvas stuck in pan mode; Ctrl and Alt key releases are handled again
- Changing font, color or size while typing text no longer closes the text editor
- Link tooltips render inside the overlay instead of as stray text at the bottom of the page
- **Ctrl+=**, **Ctrl+-** and **Ctrl+0** zoom the browser again while drawing
- Drawings follow single-page-app navigation: each URL keeps its own drawings, and back/forward shows the right ones
- The overlay stays fixed on pages that set a `transform` on `<html>`
- Closing Scribble after editing text no longer leaves a listener and the editor in memory
- Scribble no longer takes keyboard focus from the page when it reopens in view mode

## [0.1.0] - 2026-09-30

First release.

### Added

- Excalidraw canvas over any web page, injected on demand from the toolbar icon or **Alt+Shift+D**
- Draw mode and view mode: toggle or press **Esc** to switch; view mode keeps drawings visible while the page stays usable
- Drawings anchored to page coordinates, so they scroll with the page
- Per-page persistence in `chrome.storage.local`, keyed by origin, path and query
- Clear page button with undo; undo and redo buttons at the top left
- Theme follows the page's light or dark background
- Excalidraw tools from the latest editor build: sticky notes, lasso selection, bucket fill, draw to shape, frames, web embeds, laser pointer and Mermaid to Excalidraw
- Style isolation: Excalidraw's UI and dialogs render inside a Shadow DOM
- Bundled fonts and assets, with no CDN requests
- Scribble logo and extension icons
- `THIRD_PARTY_LICENSES` for Excalidraw, its fonts and all bundled npm packages, included in every build

[0.1.1]: https://github.com/Lusan-sapkota/Scribble/releases/tag/v0.1.1
[0.1.0]: https://github.com/Lusan-sapkota/Scribble/releases/tag/v0.1.0
