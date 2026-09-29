const existing = document.getElementById("scribble-host");

if (existing) {
  existing.remove();
} else {
  const host = document.createElement("div");
  host.id = "scribble-host";
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML =
    '<div style="position:absolute;top:12px;right:12px;padding:6px 10px;background:#111;color:#fff;font:13px system-ui;border-radius:6px">Scribble</div>';
  document.documentElement.append(host);
}
