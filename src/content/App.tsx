import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawProps } from "@excalidraw/excalidraw/types";

const trash = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

export default function App({ onClear, ...props }: ExcalidrawProps & { onClear: () => void }) {
  return (
    <Excalidraw
      {...props}
      renderTopRightUI={() => (
        <button className="dropdown-menu-button scribble-clear" onClick={onClear} title="Clear page" aria-label="Clear page">
          {trash}
        </button>
      )}
    />
  );
}
