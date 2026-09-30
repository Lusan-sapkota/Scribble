# Changelog

All notable changes to Scribble are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

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

[0.1.0]: https://github.com/Lusan-sapkota/Scribble/releases/tag/v0.1.0
